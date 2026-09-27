import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Headset, Link2, MessageSquare, RotateCcw, Search, Smartphone, Upload, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand";
import { DemoBar } from "@/components/demo-bar";
import { GenerateLinkForm, LinkDetails, type CreatedLink } from "@/features/generate-link";
import { CustomerUpload, UploadSuccessView } from "@/features/customer-upload";
import { SearchPanel } from "@/features/search";
import { RecordDetail } from "@/features/record-detail";
import { DEMO_ADVISOR_CODE, useSessions, type UploadSession } from "@/demo/store";
import { cn } from "@/lib/utils";

type Side = "advisor" | "customer";
type PhoneView = "locked" | "upload" | "done" | "reopened";

const STEPS: { title: string; side: Side; icon: typeof Link2; hint: string }[] = [
  { title: "Create a link", side: "advisor", icon: Link2, hint: "Create an upload link for the customer." },
  { title: "Customer uploads", side: "customer", icon: Upload, hint: "Open the link on the customer's phone and add files." },
  { title: "Read back the ID", side: "advisor", icon: Headset, hint: "Search the upload ID the customer read out." },
  { title: "Review the files", side: "advisor", icon: Search, hint: "Preview the files. Then try the link again on the phone." },
];

function randomAccount() {
  return `ACCT-${Math.floor(100000 + Math.random() * 900000)}`;
}

export default function DemoTourPage() {
  const [runId, setRunId] = useState(0);
  const [account] = useState(randomAccount);
  const [link, setLink] = useState<CreatedLink | null>(null);
  const [phone, setPhone] = useState<PhoneView>("locked");
  const [uploaded, setUploaded] = useState<UploadSession | null>(null);
  const [openedRecord, setOpenedRecord] = useState<string | null>(null);
  const [mobileSide, setMobileSide] = useState<Side>("advisor");
  const sessions = useSessions();

  const step = !link ? 0 : !uploaded ? 1 : !openedRecord ? 2 : 3;
  const record = useMemo(() => sessions.find((s) => s.uploadId === openedRecord) ?? null, [sessions, openedRecord]);

  useEffect(() => {
    setMobileSide(STEPS[step].side);
  }, [step]);

  // A reset from the demo bar removes the tour's link, so start over.
  useEffect(() => {
    if (link && !sessions.some((s) => s.uploadId === link.uploadId)) restart();
  }, [sessions]);

  function restart() {
    setLink(null);
    setPhone("locked");
    setUploaded(null);
    setOpenedRecord(null);
    setRunId((n) => n + 1);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DemoBar />
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Brand suffix="Guided tour" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={restart}>
              <RotateCcw aria-hidden />
              <span className="hidden sm:inline">Restart tour</span>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Staff workspace</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="page-glow flex-1 px-4 pb-16 pt-6 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <StepRail step={step} />

          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="max-w-3xl text-base text-muted-foreground"
            >
              {STEPS[step].hint}
            </motion.p>
          </AnimatePresence>

          <div className="inline-flex rounded-full border bg-card p-1 lg:hidden" role="tablist" aria-label="View">
            {(["advisor", "customer"] as const).map((side) => (
              <button
                key={side}
                type="button"
                role="tab"
                aria-selected={mobileSide === side}
                onClick={() => setMobileSide(side)}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  mobileSide === side ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {side === "advisor" ? <Headset className="h-4 w-4" aria-hidden /> : <Smartphone className="h-4 w-4" aria-hidden />}
                {side === "advisor" ? "Advisor" : "Customer"}
                {STEPS[step].side === side && mobileSide !== side && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />}
              </button>
            ))}
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">
            {/* Advisor */}
            <section className={cn("min-w-0", mobileSide !== "advisor" && "hidden lg:block")} aria-label="Advisor view">
              <PaneLabel icon={Headset} label="Advisor" sub={`Signed in as ${DEMO_ADVISOR_CODE}`} active={STEPS[step].side === "advisor"} />
              <div className="overflow-hidden rounded-3xl border bg-card shadow-xl shadow-ink/5">
                <div className="flex items-center gap-1.5 border-b bg-muted/60 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
                  <span className="ml-3 truncate font-mono text-xs text-muted-foreground">
                    {step === 0 ? "portal/new-link" : step === 1 ? "portal/new-link" : step === 2 ? "portal/search" : `portal/records/${openedRecord}`}
                  </span>
                </div>
                <div className="p-5 sm:p-7">
                  <AnimatePresence mode="wait">
                    <motion.div key={`${runId}-${step}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                      {step === 0 && (
                        <>
                          <h2 className="mb-5 text-xl font-semibold tracking-tight">Create upload link</h2>
                          <GenerateLinkForm
                            advisorCode={DEMO_ADVISOR_CODE}
                            defaultAccount={account}
                            defaultNote="Proof of address for account update"
                            onCreated={setLink}
                          />
                        </>
                      )}
                      {step === 1 && link && (
                        <>
                          <h2 className="mb-5 text-xl font-semibold tracking-tight">Link created</h2>
                          <LinkDetails result={link} />
                          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
                            <MessageSquare className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                            Sent by text. Waiting for the upload.
                            <Button size="sm" variant="outline" className="ml-auto shrink-0 lg:hidden" onClick={() => setMobileSide("customer")}>
                              Open phone
                            </Button>
                          </div>
                        </>
                      )}
                      {step === 2 && uploaded && (
                        <>
                          <h2 className="mb-2 text-xl font-semibold tracking-tight">Search uploads</h2>
                          <div className="mb-5 flex items-start gap-3 rounded-2xl bg-primary/5 p-4 text-sm">
                            <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                            <p>
                              <span className="text-muted-foreground">Customer on the call: </span>
                              “My upload ID is <span className="font-mono font-semibold">{uploaded.uploadId}</span>.”
                            </p>
                          </div>
                          <SearchPanel initialQuery={uploaded.uploadId} onOpenRecord={setOpenedRecord} />
                        </>
                      )}
                      {step === 3 && record && (
                        <>
                          <RecordDetail session={record} compact />
                          <TourComplete onRestart={restart} />
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* Customer */}
            <section className={cn("min-w-0", mobileSide !== "customer" && "hidden lg:block")} aria-label="Customer view">
              <PaneLabel icon={Smartphone} label="Customer" sub="Their phone" active={STEPS[step].side === "customer"} />
              <div className="phone-frame mx-auto w-full max-w-[380px] lg:sticky lg:top-6">
                <div className="phone-notch" />
                <div className="phone-screen h-[640px] max-h-[calc(100dvh-10rem)] min-h-[520px]">
                  <AnimatePresence mode="wait">
                    {phone === "locked" && (
                      <motion.div key="locked" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <LockScreen link={link} onOpen={() => setPhone("upload")} />
                      </motion.div>
                    )}
                    {phone !== "locked" && link && (
                      <motion.div
                        key={phone}
                        className="absolute inset-0 flex flex-col"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <PhoneBrowserBar token={link.token} />
                        <div className="flex-1 overflow-y-auto bg-muted/40 px-3 pb-6 pt-3">
                          {phone === "done" && uploaded ? (
                            <>
                              <UploadSuccessView session={uploaded} />
                              {openedRecord && (
                                <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setPhone("reopened")}>
                                  Open the link again
                                </Button>
                              )}
                            </>
                          ) : (
                            <CustomerUpload
                              key={phone}
                              token={link.token}
                              onUploaded={(session) => {
                                setUploaded(session);
                                setPhone("done");
                              }}
                            />
                          )}
                          {phone === "reopened" && (
                            <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => setPhone("done")}>
                              Back
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function StepRail({ step }: { step: number }) {
  return (
    <ol className="grid grid-cols-4 gap-2 sm:gap-3">
      {STEPS.map((s, i) => {
        const done = i < step;
        const current = i === step;
        const Icon = s.icon;
        return (
          <li key={s.title} className="min-w-0">
            <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div className="h-full rounded-full bg-primary" initial={false} animate={{ width: done ? "100%" : current ? "40%" : "0%" }} transition={{ duration: 0.5 }} />
            </div>
            <div className={cn("flex items-center gap-2 text-xs sm:text-sm", current ? "text-foreground" : "text-muted-foreground")}>
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                  done && "border-primary bg-primary text-primary-foreground",
                  current && "border-primary text-primary",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Icon className="h-3.5 w-3.5" aria-hidden />}
              </span>
              <span className={cn("hidden truncate font-medium sm:inline", current && "font-semibold")}>{s.title}</span>
              <span className="sr-only sm:hidden">{s.title}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function PaneLabel({ icon: Icon, label, sub, active }: { icon: typeof Headset; label: string; sub: string; active: boolean }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-sm">
      <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} aria-hidden />
      <span className="font-semibold">{label}</span>
      <span className="text-muted-foreground">{sub}</span>
      {active && (
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Your turn
        </span>
      )}
    </div>
  );
}

function LockScreen({ link, onOpen }: { link: CreatedLink | null; onOpen: () => void }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex h-full flex-col items-center bg-[linear-gradient(160deg,hsl(var(--glow-a)/0.55),hsl(var(--ink))_55%,hsl(var(--glow-b)/0.5))] px-4 pt-16 text-white">
      <p className="text-sm opacity-80">{now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}</p>
      <p className="font-display text-6xl font-semibold tabular-nums">{now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</p>

      <div className="mt-10 w-full">
        <AnimatePresence>
          {link ? (
            <motion.button
              type="button"
              onClick={onOpen}
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.3 }}
              className="w-full rounded-2xl bg-white/85 p-3.5 text-left text-slate-900 shadow-lg backdrop-blur transition-transform hover:scale-[1.02]"
            >
              <span className="flex items-center gap-2 text-xs text-slate-500">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500 text-white">
                  <MessageSquare className="h-3 w-3" aria-hidden />
                </span>
                Messages
                <span className="ml-auto">now</span>
              </span>
              <span className="mt-1.5 block text-sm font-semibold">Customer support</span>
              <span className="block text-sm leading-snug">
                Upload your documents here: <span className="break-all text-violet-700 underline">{link.uploadLink.replace(/^https?:\/\//, "").slice(0, 38)}…</span>
              </span>
              <span className="mt-2 flex items-center gap-1 text-xs font-semibold text-violet-700">
                Tap to open <ArrowRight className="h-3 w-3" aria-hidden />
              </span>
            </motion.button>
          ) : (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} exit={{ opacity: 0 }} className="text-center text-sm">
              No new messages
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PhoneBrowserBar({ token }: { token: string }) {
  return (
    <div className="border-b bg-card px-4 pb-2.5 pt-10">
      <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
        <span className="truncate">upload/{token}</span>
      </div>
    </div>
  );
}

function TourComplete({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-6 rounded-2xl bg-ink p-6 text-ink-foreground"
    >
      <p className="font-display text-2xl font-semibold">Tour complete</p>
      <p className="mt-2 text-sm opacity-80">The advisor who took the call has the files. No inbox, no callback.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button asChild className="bg-primary">
          <Link href="/login">Explore the staff workspace</Link>
        </Button>
        <Button variant="outline" className="border-white/25 bg-transparent text-ink-foreground hover:bg-white/10" onClick={onRestart}>
          <RotateCcw aria-hidden />
          Restart tour
        </Button>
      </div>
    </motion.div>
  );
}
