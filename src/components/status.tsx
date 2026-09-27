import { Link2, Upload } from "lucide-react";
import type { SessionSource, SessionStatus } from "@/demo/store";

export function StatusPill({ status }: { status: SessionStatus }) {
  return status === "complete" ? <span className="pill pill-success">Complete</span> : <span className="pill pill-warning">Pending</span>;
}

export function TokenPill({ status }: { status: SessionStatus }) {
  return status === "complete" ? <span className="pill pill-muted">Link used</span> : <span className="pill pill-info">Link active</span>;
}

export function SourcePill({ source }: { source: SessionSource }) {
  return source === "advisor_direct" ? (
    <span className="pill pill-primary">
      <Upload className="h-3 w-3" aria-hidden />
      Direct upload
    </span>
  ) : (
    <span className="pill pill-info">
      <Link2 className="h-3 w-3" aria-hidden />
      Customer link
    </span>
  );
}
