import { useState } from "react";
import { Link } from "wouter";
import { AlertTriangle, CheckCircle2, Upload } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FilePicker, type PickedFile } from "@/components/file-picker";
import { ProgressBar } from "@/components/progress-bar";
import { RecordDetail } from "@/features/record-detail";
import { getAdvisorCode } from "@/lib/auth";
import { plural } from "@/lib/files";
import { DEMO_ADVISOR_CODE, directUpload, type UploadSession } from "@/demo/store";
import { TOUR_SAMPLE_IDS } from "@/demo/samples";

export default function DirectUploadPage() {
  const [accountNumber, setAccountNumber] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [problem, setProblem] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [result, setResult] = useState<UploadSession | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accountNumber.trim() || !files.length) return;
    setProblem(null);
    setProgress(0);
    try {
      const session = await directUpload(
        { accountNumber, internalNote, advisorCode: getAdvisorCode() ?? DEMO_ADVISOR_CODE },
        files,
        setProgress,
      );
      setResult(session);
    } catch (err) {
      setProblem(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setProgress(null);
    }
  }

  function reset() {
    setResult(null);
    setAccountNumber("");
    setInternalNote("");
    setFiles([]);
  }

  const uploading = progress !== null;

  return (
    <AppLayout crumbs={[{ label: "Direct upload" }]} maxWidth="md">
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Direct upload</h1>
          <p className="mt-1 text-sm text-muted-foreground">For files received by email or post.</p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border bg-card p-5 sm:p-6">
            <div className="space-y-1.5">
              <Label htmlFor="account">Account number</Label>
              <Input
                id="account"
                placeholder="ACCT-123456"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                autoComplete="off"
                className="font-mono uppercase"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Files</Label>
              <FilePicker files={files} onChange={setFiles} onProblems={setProblem} disabled={uploading} sampleIds={TOUR_SAMPLE_IDS} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="note">
                Internal note <span className="text-xs font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="note"
                placeholder="Received by email, attached for the customer"
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                rows={2}
              />
            </div>
            {problem && (
              <div className="error-banner" role="alert">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{problem}</span>
              </div>
            )}
            {uploading ? (
              <ProgressBar value={progress} label={`Uploading ${plural(files.length, "file")}`} />
            ) : (
              <Button type="submit" className="w-full" disabled={!accountNumber.trim() || !files.length}>
                <Upload aria-hidden />
                {files.length > 1 ? `Upload ${files.length} files` : "Upload"}
              </Button>
            )}
          </form>
        ) : (
          <div className="space-y-4">
            <div className="success-banner">
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
              {plural(result.uploads.length, "file")} saved to {result.uploadId}
            </div>
            <RecordDetail session={result} />
            <div className="flex flex-wrap gap-3">
              <Button onClick={reset}>Upload more</Button>
              <Button asChild variant="outline">
                <Link href="/portal/history">View history</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
