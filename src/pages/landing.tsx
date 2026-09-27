import { useEffect, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  FileText,
  Github,
  Hash,
  Headset,
  Image as ImageIcon,
  Link2,
  Search,
  ShieldCheck,
  Smartphone,
  Upload,
  UserRoundX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand";
import { DemoBar } from "@/components/demo-bar";
import { useSessions } from "@/demo/store";

const CONTACT_HREF = "https://techshub.pro/start";
const REPO_HREF = "https://github.com/mjibulu/customer-uploads";

const FACTS = [
  { value: "Single-use", label: "upload links" },
  { value: "No login", label: "for customers" },
  { value: "20 files", label: "per upload" },
  { value: "100 MB", label: "per file" },
];

const STEPS = [
  { icon: Link2, title: "Advisor creates a link", body: "Enter the account number. The link works once." },
  { icon: Smartphone, title: "Customer uploads", body: "Photos, PDFs or videos, from their phone." },
  { icon: Hash, title: "Advisor finds the files", body: "The customer reads back an upload ID. Search it to open the record." },
];

const FEATURES = [
  { icon: ShieldCheck, title: "Single-use links", body: "A link stops working after one upload." },
  { icon: UserRoundX, title: "No customer account", body: "Nothing to install, no password." },
  { icon: Hash, title: "Upload ID read-back", body: "Ties the call to the files." },
  { icon: Upload, title: "Direct upload", body: "Attach files received by email or post." },
  { icon: Search, title: "Search", body: "By upload ID or account number." },
  { icon: Eye, title: "Preview", body: "Images, PDFs and videos, or download the original." },
];

export default function LandingPage() {
  const sessions = useSessions();
  const pendingLink = sessions.find((s) => s.source === "customer_link" && s.status === "pending");

  return (
    <div className="min-h-dvh bg-background">
      <DemoBar />
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Brand />
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
            <a href="#how" className="hidden rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground md:inline">
              How it works
            </a>
            <a href="#features" className="hidden rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground md:inline">
              Features
            </a>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/login">Staff workspace</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/demo">Start tour</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="page-glow pointer-events-none absolute inset-0" />
          <div className="grid-texture pointer-events-none absolute inset-0" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                Get customer documents during the call, not days later.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Send a single-use link. The customer uploads from their phone and reads back an upload ID. You have the files before the call ends.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/demo">
                    Start the guided tour
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
                {pendingLink && (
                  <Button asChild size="lg" variant="outline">
                    <Link href={`/upload/${pendingLink.token}`}>Open the customer page</Link>
                  </Button>
                )}
              </div>
              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                {FACTS.map((f) => (
                  <div key={f.value}>
                    <dt className="sr-only">{f.label}</dt>
                    <dd>
                      <span className="block text-lg font-semibold">{f.value}</span>
                      <span className="text-sm text-muted-foreground">{f.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            <HeroLoop />
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-20 border-y bg-card/60 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">Instant file access</h2>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, body }, i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.1 }}
                  className="relative rounded-3xl border bg-background p-6"
                >
                  <span className="absolute right-6 top-5 font-display text-5xl font-semibold text-primary/15">{i + 1}</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-muted-foreground">{body}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">What the portal does</h2>
            <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="bg-card p-6 transition-colors hover:bg-muted/40">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Accepts JPEG, PNG, GIF, WebP, PDF, MP4, MOV and WebM.</p>
          </div>
        </section>

        {/* Explore */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Explore on your own</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <ExploreCard href="/demo" icon={Headset} title="Guided tour" body="Both sides of the call." />
              <ExploreCard href="/login" icon={Search} title="Staff workspace" body="Links, direct uploads and search." />
              {pendingLink && (
                <ExploreCard href={`/upload/${pendingLink.token}`} icon={Smartphone} title="Customer page" body={`A pending link for ${pendingLink.accountNumber}.`} />
              )}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="px-4 pb-20 sm:px-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-ink-foreground sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-2xl">
                <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Want this for your team?</h2>
                <p className="mt-4 text-lg opacity-80">We adapt the portal to your process and branding, then deploy it.</p>
              </div>
              <Button asChild size="lg" className="bg-primary">
                <a href={CONTACT_HREF}>
                  Contact us
                  <ArrowRight aria-hidden />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground sm:px-6">
          <span>Attach by Techshub</span>
          <a href={REPO_HREF} className="inline-flex items-center gap-1.5 hover:text-foreground">
            <Github className="h-4 w-4" aria-hidden />
            Demo source
          </a>
        </div>
      </footer>
    </div>
  );
}

function ExploreCard({ href, icon: Icon, title, body }: { href: string; icon: typeof Headset; title: string; body: string }) {
  return (
    <Link href={href} className="group flex items-start gap-4 rounded-3xl border bg-card p-6 transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 font-semibold">
          {title}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">{body}</span>
      </span>
    </Link>
  );
}

/** Loops through the three moments of the workflow. */
function HeroLoop() {
  const reduceMotion = useReducedMotion();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => setFrame((f) => (f + 1) % 3), 3200);
    return () => clearInterval(t);
  }, [reduceMotion]);

  const labels = ["Advisor", "Customer", "Customer"];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-primary/20 via-transparent to-success/20 blur-2xl" />
      <div className="relative rounded-[2rem] border bg-card p-5 shadow-2xl shadow-ink/10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFrame(i)}
                aria-label={`Show step ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${frame === i ? "w-8 bg-primary" : "w-3 bg-muted-foreground/25"}`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-muted-foreground">{labels[frame]}</span>
        </div>

        <div className="relative h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={frame}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {frame === 0 && <FrameLink />}
              {frame === 1 && <FrameUpload />}
              {frame === 2 && <FrameDone />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function FrameLink() {
  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">Create upload link</p>
      <div className="rounded-xl border bg-muted/40 px-3.5 py-2.5 font-mono text-sm">ACCT-784521</div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-2 rounded-2xl border border-success/30 bg-success/10 p-4">
        <p className="flex items-center gap-2 text-sm font-medium text-success">
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          Link created
        </p>
        <p className="truncate rounded-lg bg-card px-3 py-2 font-mono text-xs text-muted-foreground">…/upload/9f2c41e07ab3d5…</p>
        <div className="flex items-center gap-2">
          <span className="upload-id-chip">UPL-482156</span>
          <span className="pill pill-warning">Pending</span>
        </div>
      </motion.div>
    </div>
  );
}

function FrameUpload() {
  const files = [
    { icon: FileText, name: "bank-statement-aug.pdf", tone: "text-destructive" },
    { icon: ImageIcon, name: "photo-id-front.jpg", tone: "text-info" },
  ];
  return (
    <div className="space-y-3">
      <p className="section-title !mb-0">Uploading for account</p>
      <p className="font-mono text-xl font-bold tracking-wider">ACCT-784521</p>
      {files.map(({ icon: Icon, name, tone }, i) => (
        <motion.div key={name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.25 }} className="file-item">
          <span className="file-item-icon">
            <Icon className={`h-4 w-4 ${tone}`} aria-hidden />
          </span>
          <span className="truncate text-sm font-medium">{name}</span>
        </motion.div>
      ))}
      <div className="pt-2">
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <motion.div className="h-full rounded-full bg-primary" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.2, delay: 0.6, ease: "easeInOut" }} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Uploading 2 files</p>
      </div>
    </div>
  );
}

function FrameDone() {
  return (
    <div className="id-container flex h-full flex-col items-center justify-center text-center">
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-white">
        <CheckCircle2 className="h-7 w-7" aria-hidden />
      </motion.span>
      <p className="mt-4 text-sm text-muted-foreground">Your upload ID</p>
      <p className="upload-id-hero">UPL-482156</p>
      <p className="mt-3 max-w-[16rem] text-sm text-muted-foreground">Read this ID to your advisor.</p>
    </div>
  );
}
