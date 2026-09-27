import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { AlertTriangle } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { RecordDetail } from "@/features/record-detail";
import { getSession, useSessions, type UploadSession } from "@/demo/store";

export default function RecordPage() {
  const { uploadId = "" } = useParams<{ uploadId: string }>();
  const sessions = useSessions();
  const [session, setSession] = useState<UploadSession | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    getSession(uploadId).then((found) => {
      if (!cancelled) setSession(found);
    });
    return () => {
      cancelled = true;
    };
    // Reload when records change, so a pending link updates after the customer uploads.
  }, [uploadId, sessions]);

  return (
    <AppLayout crumbs={[{ label: "Search", href: "/portal/search" }, { label: uploadId.toUpperCase() }]} maxWidth="lg">
      {session === undefined && (
        <div className="flex justify-center py-20">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-label="Loading" />
        </div>
      )}
      {session === null && (
        <div className="space-y-4">
          <div className="error-banner" role="alert">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>No record with upload ID {uploadId.toUpperCase()}.</span>
          </div>
          <Button asChild variant="outline">
            <Link href="/portal/search">Search uploads</Link>
          </Button>
        </div>
      )}
      {session && <RecordDetail session={session} />}
    </AppLayout>
  );
}
