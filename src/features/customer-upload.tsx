import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Lock, Phone, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilePicker, type PickedFile } from "@/components/file-picker";
import { ProgressBar } from "@/components/progress-bar";
import { FileIcon } from "@/components/file-icon";
import { formatFileSize, plural } from "@/lib/files";
import { getSessionByToken, uploadByToken, type TokenLookup, type UploadSession } from "@/demo/store";
import { TOUR_SAMPLE_IDS } from "@/demo/samples";

export function CustomerHeader() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-14 max-w-xl items-center gap-2.5 px-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Lock className="h-3.5 w-3.5" aria-hidden />
        </span>
        <span className="text-sm font-semibold">Secure document upload</span>
      </div>
    </header>
  );
}

interface CustomerUploadProps {
  token: string;
  onUploaded: (session: UploadSession) => void;
}

export function CustomerUpload({ token, onUploaded }: CustomerUploadProps) {
  const [lookup, setLookup] = useState<TokenLookup | null>(null);
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [problem, setProblem] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLookup(null);
    getSessionByToken(token).then((result) => {
      if (!cancelled) setLookup(result);
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!files.length) return;
    setProblem(null);
    setProgress(0);
    try {
      const session = await uploadByToken(token, files, setProgress);
      onUploaded(session);
    } catch (err) {
      setProblem(err instanceof Error ? err.message : "Upload failed. Try again.");
      setProgress(null);
    }
  }

  if (!lookup) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-sm text-muted-foreground">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
        Checking your link…
      </div>
    );
  }

  if (lookup.state !== "valid") {
    const used = lookup.state === "used";
    return (
      <div className="px-2 py-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-7 w-7 text-destructive" aria-hidden />
        </span>
        <h2 className="mt-4 text-lg font-semibold">{used ? "This link has already been used" : "This link is not valid"}</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
          {used ? "To send more files, ask your advisor for a new link." : "Check the link or ask your advisor for a new one."}
        </p>
      </div>
    );
  }

  const uploading = progress !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 rounded-2xl border bg-card p-4">
        <div className="min-w-0">
          <p className="section-title !mb-1">Uploading for account</p>
          <p className="truncate font-mono text-xl font-bold tracking-wider">{lookup.session.accountNumber}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <UserRound className="h-5 w-5 text-primary" aria-hidden />
        </span>
      </div>

      <form onSubmit={handleUpload} className="space-y-4 rounded-2xl border bg-card p-4">
        <p className="font-semibold">Add your documents</p>

        <FilePicker files={files} onChange={setFiles} onProblems={setProblem} disabled={uploading} sampleIds={TOUR_SAMPLE_IDS} compact />

        {problem && (
          <div className="error-banner" role="alert">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{problem}</span>
          </div>
        )}

        {uploading ? (
          <ProgressBar value={progress} label={`Uploading ${plural(files.length, "file")}`} />
        ) : (
          <Button type="submit" size="lg" className="w-full" disabled={!files.length}>
            {files.length > 1 ? `Upload ${files.length} files` : "Upload"}
          </Button>
        )}

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          This link works once.
        </p>
      </form>
    </div>
  );
}

export function UploadSuccessView({ session }: { session: UploadSession }) {
  return (
    <div className="space-y-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="success-banner">
        <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
        <span>Upload complete. {plural(session.uploads.length, "file")} received.</span>
      </motion.div>

      <div className="id-container rounded-2xl border bg-card px-4 py-6 text-center">
        <p className="section-title">Your upload ID</p>
        <motion.p
          initial={{ letterSpacing: "0.3em", opacity: 0 }}
          animate={{ letterSpacing: "0.08em", opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="upload-id-hero"
        >
          {session.uploadId}
        </motion.p>
      </div>

      <div className="flex gap-3 rounded-2xl border border-info/25 bg-info/10 p-4">
        <Phone className="mt-0.5 h-5 w-5 shrink-0 text-info" aria-hidden />
        <div>
          <p className="text-sm font-semibold">Read this ID to your advisor</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Your advisor uses it to find your files.</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-4">
        <dl className="info-grid">
          <dt>Account number</dt>
          <dd className="font-mono">{session.accountNumber}</dd>
          <dt>Uploaded</dt>
          <dd>{session.uploads[0] ? new Date(session.uploads[0].uploadedAt).toLocaleString() : ""}</dd>
        </dl>
        <ul className="mt-2 space-y-1.5 border-t pt-3">
          {session.uploads.map((u) => (
            <li key={u.id} className="flex items-center gap-2 text-sm">
              <FileIcon mimeType={u.mimeType} />
              <span className="min-w-0 flex-1 truncate">{u.originalName}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{formatFileSize(u.fileSize)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
