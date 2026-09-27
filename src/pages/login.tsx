import { useState } from "react";
import { useLocation } from "wouter";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brand } from "@/components/brand";
import { DemoBar } from "@/components/demo-bar";
import { setAdvisorCode } from "@/lib/auth";
import { DEMO_ADVISOR_CODE } from "@/demo/store";

export default function LoginPage() {
  const [code, setCode] = useState(DEMO_ADVISOR_CODE);
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setAdvisorCode(code.trim().toUpperCase());
      navigate("/portal");
    }, 350);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DemoBar />
      <div className="page-glow flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm rounded-3xl border bg-card p-8 shadow-xl shadow-ink/5">
          <div className="flex justify-center">
            <Brand />
          </div>
          <h1 className="mt-6 text-center text-2xl font-semibold tracking-tight">Staff sign in</h1>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="code">Access code</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" className="font-mono uppercase" />
              <p className="text-xs text-muted-foreground">Any code works. History shows records for the code you use.</p>
            </div>
            <Button type="submit" className="w-full" disabled={loading || !code.trim()}>
              <KeyRound aria-hidden />
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
