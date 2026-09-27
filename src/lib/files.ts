// Limits and accepted types match the production API.
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "video/mp4",
  "video/quicktime",
  "video/webm",
] as const;

export const ACCEPT_ATTRIBUTE = "image/jpeg,image/png,image/gif,image/webp,application/pdf,video/mp4,video/quicktime,video/webm";

export const MAX_FILES = 20;
export const MAX_FILE_BYTES = 100 * 1024 * 1024;

export type FileKind = "image" | "pdf" | "video" | "other";

const MIME_LABELS: Record<string, string> = {
  "image/jpeg": "JPEG image",
  "image/png": "PNG image",
  "image/gif": "GIF image",
  "image/webp": "WebP image",
  "image/svg+xml": "SVG image",
  "application/pdf": "PDF document",
  "video/mp4": "MP4 video",
  "video/quicktime": "QuickTime video",
  "video/webm": "WebM video",
};

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function fileKind(mimeType: string): FileKind {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("video/")) return "video";
  return "other";
}

export function mimeLabel(mimeType: string): string {
  return MIME_LABELS[mimeType] ?? mimeType;
}

export function isAllowedType(mimeType: string): boolean {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType);
}

export function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

/** Splits a selection into accepted files and human-readable rejection reasons. */
export function validateSelection(incoming: File[], alreadySelected: number) {
  const accepted: File[] = [];
  const problems: string[] = [];

  for (const file of incoming) {
    if (!isAllowedType(file.type)) {
      problems.push(`${file.name}: file type not accepted`);
    } else if (file.size > MAX_FILE_BYTES) {
      problems.push(`${file.name}: larger than 100 MB`);
    } else if (alreadySelected + accepted.length >= MAX_FILES) {
      problems.push(`${file.name}: limit is ${MAX_FILES} files per upload`);
    } else {
      accepted.push(file);
    }
  }

  return { accepted, problems };
}
