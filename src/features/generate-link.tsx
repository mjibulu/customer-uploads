import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusPill } from "@/components/status";
import { createSession, type UploadSession } from "@/demo/store";

export type CreatedLink = UploadSession & { uploadLink: string };

interface GenerateLinkFormProps {
  advisorCode: string;
  defaultAccount?: string;
  defaultNote?: string;
  onCreated: (result: CreatedLink) => void;
}

export function GenerateLinkForm({ advisorCode, defaultAccount = "", defaultNote = "", onCreated }: GenerateLinkFormProps) {
  const [accountNumber, setAccountNumber] = useState(defaultAccount);
  const [internalNote, setInternalNote] = useState(defaultNote);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accountNumber.trim()) return;
    setLoading(true);
    try {
      const result = await createSession({ accountNumber, internalNote, advisorCode });
      onCreated(result);
    } catch {
      toast.error("Could not create the link. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        <Label htmlFor="note">
          Internal note <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="note"
          placeholder="Proof of identity for account update"
          value={internalNote}
          onChange={(e) => setInternalNote(e.target.value)}
          rows={2}
        />
        <p className="text-xs text-muted-foreground">Staff only. The customer never sees it.</p>
      </div>
      <Button type="submit" className="w-full" disabled={loading || !accountNumber.trim()}>
        <Link2 aria-hidden />
        {loading ? "Creating link…" : "Create upload link"}
      </Button>
    </form>
  );
}

export function LinkDetails({ result }: { result: CreatedLink }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.uploadLink);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  }

  return (
    <div className="space-y-4">
      <dl className="info-grid">
        <dt>Upload ID</dt>
        <dd>
          <span className="upload-id-chip">{result.uploadId}</span>
        </dd>
        <dt>Account number</dt>
        <dd className="font-mono">{result.accountNumber}</dd>
        <dt>Status</dt>
        <dd>
          <StatusPill status={result.status} />
        </dd>
      </dl>
      <div>
        <p className="section-title">Customer upload link</p>
        <div className="flex gap-2">
          <Input readOnly value={result.uploadLink} className="min-w-0 bg-muted/50 font-mono" aria-label="Customer upload link" onFocus={(e) => e.target.select()} />
          <Button type="button" variant="outline" onClick={handleCopy} className="shrink-0" aria-label="Copy link">
            {copied ? <Check className="text-success" aria-hidden /> : <Copy aria-hidden />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">Works for one upload.</p>
      </div>
    </div>
  );
}
