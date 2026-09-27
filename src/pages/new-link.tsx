import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { GenerateLinkForm, LinkDetails, type CreatedLink } from "@/features/generate-link";
import { getAdvisorCode } from "@/lib/auth";
import { DEMO_ADVISOR_CODE } from "@/demo/store";

export default function NewLinkPage() {
  const [result, setResult] = useState<CreatedLink | null>(null);
  const advisorCode = getAdvisorCode() ?? DEMO_ADVISOR_CODE;

  return (
    <AppLayout crumbs={[{ label: "New link" }]} maxWidth="md">
      <div className="space-y-5">
        <h1 className="text-2xl font-semibold tracking-tight">Create upload link</h1>
        {!result ? (
          <div className="rounded-2xl border bg-card p-5 sm:p-6">
            <GenerateLinkForm advisorCode={advisorCode} onCreated={setResult} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="success-banner">
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
              Link created
            </div>
            <div className="rounded-2xl border bg-card p-5 sm:p-6">
              <LinkDetails result={result} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href={result.uploadLink} target="_blank" rel="noreferrer">
                  Open as customer
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/portal/records/${result.uploadId}`}>Open record</Link>
              </Button>
              <Button variant="ghost" onClick={() => setResult(null)}>
                Create another
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
