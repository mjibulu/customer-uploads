import { useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SourcePill, StatusPill } from "@/components/status";
import { FileIcon } from "@/components/file-icon";
import { formatFileSize } from "@/lib/files";
import { searchByAccount, searchByUploadId, type UploadSession } from "@/demo/store";

type Mode = "uploadId" | "account";

interface SearchPanelProps {
  initialQuery?: string;
  initialMode?: Mode;
  /** When set, results open in place instead of navigating. */
  onOpenRecord?: (uploadId: string) => void;
}

export function SearchPanel({ initialQuery = "", initialMode = "uploadId", onOpenRecord }: SearchPanelProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UploadSession[] | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const found = mode === "uploadId" ? await searchByUploadId(query) : await searchByAccount(query);
    setResults(found);
    setLoading(false);
  }

  function switchMode(next: Mode) {
    setMode(next);
    setQuery("");
    setResults(null);
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="inline-flex rounded-full border bg-muted/60 p-1" role="tablist" aria-label="Search by">
          {(["uploadId", "account"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                mode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "uploadId" ? "Upload ID" : "Account number"}
            </button>
          ))}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="search-query">{mode === "uploadId" ? "Upload ID" : "Account number"}</Label>
          <div className="flex gap-2">
            <Input
              id="search-query"
              placeholder={mode === "uploadId" ? "UPL-482156" : "ACCT-784521"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              className="min-w-0 flex-1 font-mono uppercase"
            />
            <Button type="submit" disabled={loading || !query.trim()} className="shrink-0">
              <Search aria-hidden />
              <span className="hidden sm:inline">{loading ? "Searching…" : "Search"}</span>
            </Button>
          </div>
        </div>
      </form>

      <AnimatePresence mode="wait">
        {results && results.length === 0 && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="empty-state rounded-2xl border border-dashed">
            <SearchX className="mx-auto mb-3 h-8 w-8 opacity-40" aria-hidden />
            <p className="font-medium text-foreground">No records found</p>
            <p className="mt-1 text-sm">Check the {mode === "uploadId" ? "upload ID" : "account number"} and try again.</p>
          </motion.div>
        )}
        {results && results.length > 0 && (
          <motion.div key="results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? "record" : "records"}
            </p>
            {results.map((s) => (
              <ResultCard key={s.uploadId} session={s} onOpenRecord={onOpenRecord} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ResultCard({ session, onOpenRecord }: { session: UploadSession; onOpenRecord?: (uploadId: string) => void }) {
  const open = onOpenRecord ? (
    <Button variant="outline" size="sm" onClick={() => onOpenRecord(session.uploadId)}>
      Open record
    </Button>
  ) : (
    <Button asChild variant="outline" size="sm">
      <Link href={`/portal/records/${session.uploadId}`}>Open record</Link>
    </Button>
  );

  return (
    <div className="result-row p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="upload-id-chip">{session.uploadId}</span>
          <SourcePill source={session.source} />
          <StatusPill status={session.status} />
        </div>
        {open}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
        <span>
          Account <span className="font-mono font-medium text-foreground">{session.accountNumber}</span>
        </span>
        <span>
          Created <span className="text-foreground">{new Date(session.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</span>
        </span>
      </div>
      {session.uploads.length > 0 ? (
        <ul className="mt-3 space-y-1.5 border-t pt-3">
          {session.uploads.map((u) => (
            <li key={u.id} className="flex items-center gap-2 text-xs">
              <FileIcon mimeType={u.mimeType} className="h-3.5 w-3.5" />
              <span className="min-w-0 truncate font-medium">{u.originalName}</span>
              <span className="shrink-0 text-muted-foreground">{formatFileSize(u.fileSize)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">No files yet</p>
      )}
    </div>
  );
}
