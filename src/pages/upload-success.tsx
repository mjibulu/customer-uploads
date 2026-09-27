import { Redirect, useSearch } from "wouter";
import { DemoBar } from "@/components/demo-bar";
import { CustomerHeader, UploadSuccessView } from "@/features/customer-upload";
import { useSessions } from "@/demo/store";

export default function UploadSuccessPage() {
  const id = new URLSearchParams(useSearch()).get("id");
  const session = useSessions().find((s) => s.uploadId === id && s.status === "complete");

  if (!session) return <Redirect to="/" />;

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <DemoBar />
      <CustomerHeader />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-xl">
          <UploadSuccessView session={session} />
        </div>
      </main>
    </div>
  );
}
