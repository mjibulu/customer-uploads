import { Link } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  LockKeyhole,
  MessageSquareMore,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const contactHref = "https://techshub.pro/start";
const previewHref = "/upload/demo-preview";

const highlights = [
  "Fixed public preview of the customer upload page",
  "Single demo upload code for consistent UI review",
  "Private staff tools and backend kept out of this repo",
];

const stats = [
  { value: "Days, not months", label: "to adapt the experience to your process" },
  { value: "Single-use", label: "customer upload links for tighter control" },
  { value: "100 MB", label: "per file for real-world documents and media" },
];

const featureCards = [
  {
    icon: ShieldCheck,
    title: "Safer document collection",
    body: "Replace messy inboxes and ad-hoc file sharing with branded, controlled upload journeys your team can trust.",
  },
  {
    icon: Building2,
    title: "Built around your operation",
    body: "We can tailor the flow for advisers, case handlers, claims teams, legal intake, onboarding, and more.",
  },
  {
    icon: LockKeyhole,
    title: "Internal-only workspace",
    body: "Staff get a simple protected portal to generate links, track activity, review uploads, and move faster.",
  },
];

const processSteps = [
  "We map the document-collection workflow your business already uses.",
  "We configure the portal, branding, and internal controls around your team.",
  "We deploy, test, and hand over an experience your staff can use immediately.",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f4efe3_0%,#fbfaf5_28%,#f7f8f2_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[38rem] bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_36%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_32%),radial-gradient(circle_at_center,rgba(15,23,42,0.08),transparent_48%)]" />

      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#fbfaf5]/85 backdrop-blur">
        <div className="mx-auto flex min-h-18 max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-slate-950 text-white shadow-lg shadow-purple-200/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-serif text-xl tracking-tight">Attach</p>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">by Techshub</p>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <a href="#why" className="hidden text-sm text-slate-600 transition hover:text-slate-950 md:inline-block">
              Why it works
            </a>
            <a href="#contact" className="hidden text-sm text-slate-600 transition hover:text-slate-950 md:inline-block">
              Get started
            </a>
            <Button asChild variant="outline" className="rounded-full border-slate-300 bg-white/80 px-5 text-slate-900">
              <Link href={previewHref}>Open Demo Preview</Link>
            </Button>
            <Button
              asChild
              className="rounded-full border-0 bg-slate-950 px-5 text-white shadow-lg shadow-purple-300/30 hover:bg-slate-800"
            >
              <a href={contactHref}>Contact us</a>
            </Button>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl gap-16 px-6 pb-20 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800">
              <BadgeCheck className="h-4 w-4" />
              Customer uploads without the usual friction
            </div>

            <h1 className="max-w-4xl font-serif text-5xl leading-none tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              A polished client upload portal your business can actually deploy.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              We implement secure document collection experiences for businesses that need a cleaner, more controlled alternative to email attachments and chaotic follow-ups.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full border-0 bg-purple-500 px-7 text-base text-white shadow-xl shadow-purple-200 hover:bg-purple-400"
              >
                <a href={contactHref}>
                  Contact us
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full rounded-full border-slate-300 bg-white/85 px-7 text-base text-slate-900 sm:w-auto"
              >
                <Link href={previewHref}>View Upload Page</Link>
              </Button>
            </div>

            <ul className="mt-8 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm shadow-stone-200/60">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 hidden h-24 w-24 rounded-full bg-emerald-300/30 blur-2xl lg:block" />
            <div className="absolute -right-8 bottom-8 hidden h-28 w-28 rounded-full bg-purple-300/40 blur-2xl lg:block" />

            <div className="rounded-[2rem] border border-slate-900/10 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-400/20">
              <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
                  <span>Advisor workflow</span>
                  <span>Live concept</span>
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="rounded-2xl bg-white/6 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Generate secure link</p>
                        <p className="mt-1 text-2xl font-semibold tracking-tight">UPLOAD-DEMO-001</p>
                      </div>
                      <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300">
                        Single use
                      </span>
                    </div>
                    <div className="mt-4 rounded-xl border border-white/8 bg-black/20 px-4 py-3 font-mono text-xs text-slate-300">
                      https://yourbrand.com/upload/demo-preview
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-5 text-slate-900">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Customer experience</p>
                      <p className="mt-3 text-lg font-semibold">Drop files. Confirm. Done.</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        A focused upload page that removes confusion and keeps completion rates high.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-purple-50 p-5 text-slate-900">
                      <p className="text-xs uppercase tracking-[0.22em] text-purple-700">Private delivery</p>
                      <p className="mt-3 text-lg font-semibold">Staff workspace stays off the public repo</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        This showcase focuses on the customer-facing upload journey. Internal auth, search, and operational tooling remain private.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {stats.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                        <p className="text-lg font-semibold text-white">{item.value}</p>
                        <p className="mt-1 text-sm leading-5 text-slate-300">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="why" className="border-y border-black/5 bg-white/55 py-20 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-purple-600">Why businesses ask for this</p>
              <h2 className="mt-4 font-serif text-4xl tracking-tight text-slate-950 sm:text-5xl">
                The product solves a messy operational problem, not just a design problem.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {featureCards.map(({ icon: Icon, title, body }) => (
                <article key={title} className="rounded-[1.75rem] border border-slate-200 bg-[#fffdf8] p-7 shadow-sm shadow-stone-200/70">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-700">Implementation</p>
            <h2 className="mt-4 font-serif text-4xl tracking-tight text-slate-950 sm:text-5xl">
              You bring the business rules. We shape the portal around them.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              This is ideal for teams handling client onboarding, compliance evidence, claims documents, account verification, or any workflow where secure attachments need structure.
            </p>
          </div>

          <div className="grid gap-4">
            {processSteps.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-[1.5rem] border border-slate-200 bg-white/85 p-5 shadow-sm shadow-stone-200/60">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700">
                  0{index + 1}
                </div>
                <p className="pt-2 text-base leading-7 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="px-6 pb-20">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-900/10 bg-slate-950 px-8 py-10 text-white shadow-2xl shadow-slate-300/20 sm:px-12 sm:py-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-purple-200">
                  <MessageSquareMore className="h-4 w-4" />
                  Let's get started
                </p>
                <h2 className="mt-5 font-serif text-4xl tracking-tight sm:text-5xl">
                  If you want this experience for your business, let&apos;s build it around your workflow.
                </h2>
                <p className="mt-4 text-lg leading-8 text-slate-300">
                  Tell us how your team collects customer documents today, and we&apos;ll discuss implementation, branding, and rollout.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild size="lg" className="rounded-full border-0 bg-purple-500 px-7 text-base text-white hover:bg-purple-400">
                  <a href={contactHref}>Contact us</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full border-white/20 bg-transparent px-7 text-base text-white sm:w-auto"
                >
                  <Link href={previewHref}>Open Demo Preview</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
