// In-browser stand-in for the production API. Function names and return shapes
// follow the real routes (sessions, uploads, search, advisor history) so the
// pages read the same way as the production app.
import { useEffect, useState, useSyncExternalStore } from "react";
import { MAX_FILES, validateSelection } from "@/lib/files";
import { SAMPLES, createSampleFile, type SampleId } from "./samples";

export type SessionSource = "customer_link" | "advisor_direct";
export type SessionStatus = "pending" | "complete";

export interface StoredUpload {
  id: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: string;
  /** Set for generated sample files, which can be recreated after a reload. */
  sampleId?: SampleId;
}

export interface UploadSession {
  uploadId: string;
  token: string;
  accountNumber: string;
  internalNote: string | null;
  advisorCode: string;
  status: SessionStatus;
  source: SessionSource;
  createdAt: string;
  uploads: StoredUpload[];
}

export type TokenLookup =
  | { state: "valid"; session: UploadSession }
  | { state: "used"; session: UploadSession }
  | { state: "invalid" };

export const DEMO_ADVISOR_CODE = "ADV-1024";

const STORAGE_KEY = "attach-demo:v1";
const LATENCY_MS = 450;

type Listener = () => void;
const listeners = new Set<Listener>();
let sessions: UploadSession[] = load();

/** Object URLs for files picked in this tab. They do not survive a reload. */
const blobUrls = new Map<string, string>();

function emit() {
  for (const listener of listeners) listener();
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). The demo keeps working in memory.
  }
}

function load(): UploadSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as UploadSession[];
    }
  } catch {
    // Fall through to seed data.
  }
  return seed();
}

function commit(next: UploadSession[]) {
  sessions = next;
  save();
  emit();
}

function wait(ms = LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomHex(bytes: number) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
}

function newUploadId() {
  const taken = new Set(sessions.map((s) => s.uploadId));
  let id: string;
  do {
    const n = new Uint32Array(1);
    crypto.getRandomValues(n);
    id = `UPL-${String(100000 + (n[0] % 900000))}`;
  } while (taken.has(id));
  return id;
}

function newUploadRowId() {
  return `f_${randomHex(6)}`;
}

function minutesAgo(mins: number) {
  return new Date(Date.now() - mins * 60_000).toISOString();
}

function sampleUpload(sampleId: SampleId, uploadedAt: string): StoredUpload {
  const def = SAMPLES[sampleId];
  return {
    id: newUploadRowId(),
    originalName: def.name,
    mimeType: def.mimeType,
    fileSize: def.approxBytes,
    uploadedAt,
    sampleId,
  };
}

function seed(): UploadSession[] {
  const completeAt = minutesAgo(60 * 26);
  const directAt = minutesAgo(60 * 3);
  return [
    {
      uploadId: "UPL-482156",
      token: randomHex(32),
      accountNumber: "ACCT-784521",
      internalNote: "Proof of address for card replacement.",
      advisorCode: DEMO_ADVISOR_CODE,
      status: "complete",
      source: "customer_link",
      createdAt: minutesAgo(60 * 26 + 6),
      uploads: [sampleUpload("bank-statement", completeAt), sampleUpload("photo-id", completeAt)],
    },
    {
      uploadId: "UPL-590317",
      token: randomHex(32),
      accountNumber: "ACCT-300912",
      internalNote: "Customer is sending photos after the call.",
      advisorCode: DEMO_ADVISOR_CODE,
      status: "pending",
      source: "customer_link",
      createdAt: minutesAgo(45),
      uploads: [],
    },
    {
      uploadId: "UPL-613884",
      token: randomHex(32),
      accountNumber: "ACCT-651207",
      internalNote: "Received by post, scanned and attached for the claim.",
      advisorCode: DEMO_ADVISOR_CODE,
      status: "complete",
      source: "advisor_direct",
      createdAt: directAt,
      uploads: [sampleUpload("parcel-photo", directAt)],
    },
  ];
}

// Public reads

export function getSessions() {
  return sessions;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Re-renders when any record changes. */
export function useSessions() {
  return useSyncExternalStore(subscribe, getSessions, getSessions);
}

export function tokenStatus(session: UploadSession): "active" | "used" {
  return session.status === "complete" ? "used" : "active";
}

export function uploadLinkFor(token: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${window.location.origin}${base}/upload/${token}`;
}

// API equivalents

/** POST /api/sessions */
export async function createSession(input: { accountNumber: string; internalNote: string | null; advisorCode: string }) {
  await wait();
  const session: UploadSession = {
    uploadId: newUploadId(),
    token: randomHex(32),
    accountNumber: input.accountNumber.trim().toUpperCase(),
    internalNote: input.internalNote?.trim() || null,
    advisorCode: input.advisorCode,
    status: "pending",
    source: "customer_link",
    createdAt: new Date().toISOString(),
    uploads: [],
  };
  commit([session, ...sessions]);
  return { ...session, uploadLink: uploadLinkFor(session.token) };
}

/** GET /api/sessions/token/:token */
export async function getSessionByToken(token: string): Promise<TokenLookup> {
  await wait(350);
  const session = sessions.find((s) => s.token === token);
  if (!session || session.source !== "customer_link") return { state: "invalid" };
  if (session.status === "complete") return { state: "used", session };
  return { state: "valid", session };
}

/** GET /api/sessions/:uploadId */
export async function getSession(uploadId: string) {
  await wait(300);
  return sessions.find((s) => s.uploadId.toUpperCase() === uploadId.trim().toUpperCase()) ?? null;
}

/** GET /api/advisor/history */
export async function advisorHistory(advisorCode: string) {
  await wait(300);
  return sessions.filter((s) => s.advisorCode === advisorCode);
}

/** GET /api/search/upload-id/:uploadId */
export async function searchByUploadId(query: string) {
  await wait(350);
  const q = query.trim().toUpperCase();
  return sessions.filter((s) => s.uploadId === q);
}

/** GET /api/search/account/:accountNumber */
export async function searchByAccount(query: string) {
  await wait(350);
  const q = query.trim().toUpperCase();
  return sessions.filter((s) => s.accountNumber.toUpperCase() === q);
}

export interface UploadInput {
  file: File;
  sampleId?: SampleId;
}

async function simulateTransfer(items: UploadInput[], onProgress?: (fraction: number) => void) {
  const total = items.reduce((sum, i) => sum + i.file.size, 0);
  // Scale the fake transfer to the payload so bigger files feel bigger, capped for the demo.
  const duration = Math.min(2600, 700 + total / 40_000);
  const start = performance.now();
  await new Promise<void>((resolve) => {
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      onProgress?.(1 - Math.pow(1 - t, 2));
      if (t < 1) requestAnimationFrame(tick);
      else resolve();
    }
    requestAnimationFrame(tick);
  });
}

function storeFiles(items: UploadInput[]): StoredUpload[] {
  const uploadedAt = new Date().toISOString();
  return items.map(({ file, sampleId }) => {
    const id = newUploadRowId();
    blobUrls.set(id, URL.createObjectURL(file));
    return { id, originalName: file.name, mimeType: file.type, fileSize: file.size, uploadedAt, sampleId };
  });
}

function assertFiles(items: UploadInput[]) {
  if (items.length === 0) throw new Error("Add at least one file.");
  if (items.length > MAX_FILES) throw new Error(`Upload up to ${MAX_FILES} files at a time.`);
  const { problems } = validateSelection(items.map((i) => i.file), 0);
  if (problems.length) throw new Error(problems.join(". "));
}

/** POST /api/uploads/by-token/:token */
export async function uploadByToken(token: string, items: UploadInput[], onProgress?: (fraction: number) => void) {
  assertFiles(items);
  const current = sessions.find((s) => s.token === token);
  if (!current || current.source !== "customer_link") throw new Error("This upload link is not valid.");
  if (current.status === "complete") throw new Error("This upload link has already been used.");

  await simulateTransfer(items, onProgress);
  const uploads = storeFiles(items);
  const updated: UploadSession = { ...current, status: "complete", uploads };
  commit(sessions.map((s) => (s.token === token ? updated : s)));
  return updated;
}

/** POST /api/uploads/direct */
export async function directUpload(
  input: { accountNumber: string; internalNote: string | null; advisorCode: string },
  items: UploadInput[],
  onProgress?: (fraction: number) => void,
) {
  assertFiles(items);
  await simulateTransfer(items, onProgress);
  const session: UploadSession = {
    uploadId: newUploadId(),
    token: randomHex(32),
    accountNumber: input.accountNumber.trim().toUpperCase(),
    internalNote: input.internalNote?.trim() || null,
    advisorCode: input.advisorCode,
    status: "complete",
    source: "advisor_direct",
    createdAt: new Date().toISOString(),
    uploads: storeFiles(items),
  };
  commit([session, ...sessions]);
  return session;
}

/** Clears everything created in this browser and restores the sample records. */
export function resetDemo() {
  for (const url of blobUrls.values()) URL.revokeObjectURL(url);
  blobUrls.clear();
  commit(seed());
}

// File access (GET /api/uploads/:id/file)

export type FileUrlState = { status: "loading" } | { status: "ready"; url: string } | { status: "missing" };

async function resolveFileUrl(upload: StoredUpload): Promise<string | null> {
  const existing = blobUrls.get(upload.id);
  if (existing) return existing;
  if (!upload.sampleId) return null;
  const file = await createSampleFile(upload.sampleId);
  const url = URL.createObjectURL(file);
  blobUrls.set(upload.id, url);
  return url;
}

/** Resolves a previewable URL for a stored file, recreating sample files when needed. */
export function useFileUrl(upload: StoredUpload): FileUrlState {
  const [state, setState] = useState<FileUrlState>(() => {
    const url = blobUrls.get(upload.id);
    return url ? { status: "ready", url } : { status: "loading" };
  });

  useEffect(() => {
    let cancelled = false;
    resolveFileUrl(upload)
      .then((url) => {
        if (!cancelled) setState(url ? { status: "ready", url } : { status: "missing" });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "missing" });
      });
    return () => {
      cancelled = true;
    };
  }, [upload]);

  return state;
}
