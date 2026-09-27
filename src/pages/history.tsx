import { useMemo } from "react";
import { Link } from "wouter";
import { ClipboardList, Link2 } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { ResultCard } from "@/features/search";
import { getAdvisorCode } from "@/lib/auth";
import { useSessions } from "@/demo/store";

export default function HistoryPage() {
  const sessions = useSessions();
  const advisorCode = getAdvisorCode();
  const history = useMemo(() => sessions.filter((s) => s.advisorCode === advisorCode), [sessions, advisorCode]);

  return (
    <AppLayout crumbs={[{ label: "History" }]} maxWidth="lg">
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My history</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Created with access code <span className="font-mono text-foreground">{advisorCode}</span>
            </p>
          </div>
          <Button asChild>
            <Link href="/portal/new-link">
              <Link2 aria-hidden />
              New link
            </Link>
          </Button>
        </div>

        {history.length === 0 ? (
          <div className="empty-state rounded-2xl border border-dashed">
            <ClipboardList className="mx-auto mb-3 h-8 w-8 opacity-40" aria-hidden />
            <p className="font-medium text-foreground">No history yet</p>
            <p className="mt-1 text-sm">Links and direct uploads you create appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((s) => (
              <ResultCard key={s.uploadId} session={s} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
