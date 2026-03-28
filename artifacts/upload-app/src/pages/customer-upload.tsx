import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const DEMO_TOKEN = "demo-preview";

interface SessionInfo {
  uploadId: string;
  accountNumber: string;
  status: string;
}

interface SelectedFile {
  file: File;
  id: string;
}

function fileSizeLabel(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) {
    return (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  }
  if (mimeType === "application/pdf") {
    return (
      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.876V15a1 1 0 01-1.447.894L15 13.8M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
    </svg>
  );
}

export default function CustomerUploadPage() {
  const [, setLocation] = useLocation();

  const [session, setSession] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch(`/api/sessions/token/${DEMO_TOKEN}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error);
        }
        setSession(await res.json());
      } catch (err: any) {
        setError(err.message || "This upload link is not valid.");
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  function addFiles(newFiles: FileList | null) {
    if (!newFiles) return;
    const allowed = ["image/jpeg","image/png","image/gif","image/webp","application/pdf","video/mp4","video/quicktime","video/webm"];
    const valid: SelectedFile[] = [];
    const rejected: string[] = [];
    for (const file of newFiles) {
      if (!allowed.includes(file.type)) {
        rejected.push(file.name);
      } else {
        valid.push({ file, id: `${file.name}-${file.lastModified}-${Math.random()}` });
      }
    }
    if (rejected.length > 0) {
      setUploadError(`Unsupported file type: ${rejected.join(", ")}. Please use images, PDFs, or videos.`);
    } else {
      setUploadError(null);
    }
    setSelectedFiles((prev) => [...prev, ...valid]);
  }

  function removeFile(id: string) {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (selectedFiles.length === 0 || !session) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      for (const sf of selectedFiles) {
        formData.append("files", sf.file);
      }

      const res = await fetch(`/api/uploads/by-token/${DEMO_TOKEN}`, { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      const data = await res.json();
      // Pass success data via sessionStorage to avoid URL length limits
      sessionStorage.setItem("upload_success", JSON.stringify({
        uploadId: data.uploadId,
        accountNumber: data.accountNumber,
        uploadedAt: data.uploadedAt,
        fileCount: data.fileCount,
        files: data.files,
      }));
      setLocation("/upload/success");
    } catch (err: any) {
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Verifying upload link…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Link Not Valid</h2>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <p className="text-xs text-muted-foreground border-t pt-4">
              If you believe this is an error, contact your advisor and ask them to generate a new upload link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal customer header */}
      <header className="border-b bg-card shadow-sm">
        <div className="max-w-2xl mx-auto px-6 h-13 flex items-center gap-2.5 py-3.5">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <span className="font-semibold text-sm">Secure Document Upload</span>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="max-w-xl w-full space-y-4">
          {/* Account card */}
          <Card>
            <CardContent className="py-5 px-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="mb-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Public Preview
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Account Number</p>
                  <p className="text-2xl font-bold font-mono tracking-wider">{session?.accountNumber}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Demo upload code: <span className="font-mono text-foreground">{session?.uploadId}</span>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload form */}
          <Card>
            <CardHeader className="pb-2 px-6 pt-5">
              <p className="font-semibold text-base">Select files to upload</p>
              <p className="text-sm text-muted-foreground">Images, PDFs, and videos accepted. You can select multiple files.</p>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
                  This page uses a single fixed demo token and upload code so the public preview always shows the same journey.
                </div>
                {/* Drop zone */}
                <div
                  className={`dropzone${dragOver ? " drag-over" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                >
                  <svg className="w-9 h-9 mx-auto mb-2.5 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <p className="text-sm font-medium text-foreground">
                    {dragOver ? "Drop files here" : "Drag files here, or click to browse"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">100 MB max per file</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf,video/mp4,video/quicktime,video/webm"
                  multiple
                  onChange={(e) => addFiles(e.target.files)}
                  className="hidden"
                />

                {/* Selected file list */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="section-title">{selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""} selected</p>
                    {selectedFiles.map((sf) => (
                      <div key={sf.id} className="file-item">
                        <div className="file-item-icon">{fileIcon(sf.file.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{sf.file.name}</p>
                          <p className="text-xs text-muted-foreground">{fileSizeLabel(sf.file.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(sf.id)}
                          className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Error */}
                {uploadError && (
                  <div className="error-banner">
                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <span>{uploadError}</span>
                  </div>
                )}

                <Button type="submit" className="w-full h-11 text-base" disabled={selectedFiles.length === 0 || uploading}>
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading…
                    </span>
                  ) : `Upload attachment${selectedFiles.length > 1 ? "s" : ""}`}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                This link can only be used once. Your files are securely transmitted.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
