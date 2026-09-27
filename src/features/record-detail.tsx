import { useEffect, useState } from "react";
import { Download, Eye, FileQuestion, Inbox, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SourcePill, StatusPill, TokenPill } from "@/components/status";
import { fileKind, formatFileSize, mimeLabel, plural } from "@/lib/files";
import { useFileUrl, type StoredUpload, type UploadSession } from "@/demo/store";

export function RecordDetail({ session, compact }: { session: UploadSession; compact?: boolean }) {
  return (
    <div className="space-y-5">
      <section className="id-container rounded-2xl border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-title !mb-1">Upload ID</p>
            <p className={compact ? "font-mono text-2xl font-bold tracking-wider" : "upload-id-hero"}>{session.uploadId}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SourcePill source={session.source} />
            <StatusPill status={session.status} />
            {session.source === "customer_link" && <TokenPill status={session.status} />}
          </div>
        </div>
        <dl className="info-grid mt-4">
          <dt>Account number</dt>
          <dd className="font-mono">{session.accountNumber}</dd>
          <dt>Created</dt>
          <dd>{new Date(session.createdAt).toLocaleString()}</dd>
          <dt>Files</dt>
          <dd>
            {session.uploads.length ? (
              `${plural(session.uploads.length, "file")}, ${new Date(session.uploads[0].uploadedAt).toLocaleString()}`
            ) : (
              <span className="font-normal italic text-muted-foreground">Not uploaded yet</span>
            )}
          </dd>
          <dt>Internal note</dt>
          <dd>{session.internalNote ?? <span className="font-normal italic text-muted-foreground">None</span>}</dd>
        </dl>
      </section>

      {session.uploads.length > 0 ? (
        <section className="space-y-4">
          <p className="section-title">Attachments ({session.uploads.length})</p>
          {session.uploads.map((u) => (
            <FilePreview key={u.id} upload={u} compact={compact} />
          ))}
        </section>
      ) : (
        <div className="empty-state rounded-2xl border border-dashed">
          <Inbox className="mx-auto mb-3 h-8 w-8 opacity-40" aria-hidden />
          <p className="font-medium text-foreground">No files yet</p>
          <p className="mt-1 text-sm">The customer has not used the link.</p>
        </div>
      )}
    </div>
  );
}

function FilePreview({ upload, compact }: { upload: StoredUpload; compact?: boolean }) {
  const file = useFileUrl(upload);
  const kind = fileKind(upload.mimeType);
  const [viewerOpen, setViewerOpen] = useState(false);
  const url = file.status === "ready" ? file.url : null;

  return (
    <article className="overflow-hidden rounded-2xl border bg-card">
      <header className="flex flex-wrap items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{upload.originalName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {mimeLabel(upload.mimeType)} · {formatFileSize(upload.fileSize)}
          </p>
        </div>
        {url && (
          <div className="flex shrink-0 gap-2">
            {kind === "image" && (
              <Button variant="outline" size="sm" onClick={() => setViewerOpen(true)}>
                <Eye aria-hidden />
                View
              </Button>
            )}
            <Button asChild variant="outline" size="sm">
              <a href={url} download={upload.originalName}>
                <Download aria-hidden />
                Download
              </a>
            </Button>
          </div>
        )}
      </header>

      <div className="preview-container">
        {file.status === "loading" && <div className="h-48 animate-pulse bg-muted" />}
        {file.status === "missing" && (
          <div className="empty-state !py-8">
            <FileQuestion className="mx-auto mb-2 h-7 w-7 opacity-40" aria-hidden />
            <p className="text-sm font-medium text-foreground">Preview unavailable</p>
            <p className="mt-1 text-xs">Files you add in the demo are cleared when the page reloads.</p>
          </div>
        )}
        {url && kind === "image" && (
          <button type="button" className="flex w-full items-center justify-center p-4" onClick={() => setViewerOpen(true)} aria-label={`View ${upload.originalName}`}>
            <img src={url} alt={upload.originalName} className={`max-w-full rounded-lg object-contain shadow-sm ${compact ? "max-h-56" : "max-h-[460px]"}`} />
          </button>
        )}
        {url && kind === "video" && (
          <video src={url} controls className={`w-full bg-black ${compact ? "max-h-56" : "max-h-[460px]"}`} />
        )}
        {url && kind === "pdf" && <iframe src={url} title={upload.originalName} className={`w-full border-0 bg-white ${compact ? "h-72" : "h-[460px]"}`} />}
      </div>

      {url && kind === "image" && <ImageViewer upload={upload} url={url} open={viewerOpen} onOpenChange={setViewerOpen} />}
    </article>
  );
}

function ImageViewer({ upload, url, open, onOpenChange }: { upload: StoredUpload; url: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!open) setZoom(1);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-5xl gap-0 overflow-hidden rounded-2xl p-0">
        <DialogHeader className="px-5 pb-3 pt-5">
          <DialogTitle className="truncate pr-8">{upload.originalName}</DialogTitle>
          <DialogDescription>
            {mimeLabel(upload.mimeType)} · {formatFileSize(upload.fileSize)}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 border-b px-5 pb-3">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} aria-label="Zoom out">
            <Minus aria-hidden />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoom(1)}>
            {Math.round(zoom * 100)}%
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom((z) => Math.min(4, z + 0.25))} aria-label="Zoom in">
            <Plus aria-hidden />
          </Button>
        </div>
        <div className="h-[70vh] overflow-auto bg-muted/50 p-4">
          <div className="flex min-h-full min-w-full items-start justify-center">
            <img src={url} alt={upload.originalName} className="max-w-none rounded shadow-md" style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
