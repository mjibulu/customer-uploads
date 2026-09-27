import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, History, Link2, Search, Upload } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { getAdvisorCode } from "@/lib/auth";
import { useSessions } from "@/demo/store";

const ACTIONS = [
  { href: "/portal/new-link", icon: Link2, title: "Create upload link", body: "Single-use link for a customer on the call." },
  { href: "/portal/direct-upload", icon: Upload, title: "Direct upload", body: "Attach files received by email or post." },
  { href: "/portal/search", icon: Search, title: "Search uploads", body: "By upload ID or account number." },
  { href: "/portal/history", icon: History, title: "My history", body: "Links and uploads made with your code." },
];

export default function PortalHome() {
  const sessions = useSessions();
  const advisorCode = getAdvisorCode();
  const mine = sessions.filter((s) => s.advisorCode === advisorCode);
  const stats = [
    { label: "Pending links", value: mine.filter((s) => s.status === "pending").length },
    { label: "Completed", value: mine.filter((s) => s.status === "complete").length },
    { label: "Files received", value: mine.reduce((n, s) => n + s.uploads.length, 0) },
  ];

  return (
    <AppLayout maxWidth="xl">
      <div className="space-y-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Customer attachments</h1>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border bg-card p-4">
              <p className="text-2xl font-semibold tabular-nums sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {ACTIONS.map(({ href, icon: Icon, title, body }, i) => (
            <motion.div key={href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link
                href={href}
                className="group flex h-full items-start gap-4 rounded-2xl border bg-card p-5 transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 font-semibold">
                    {title}
                    <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{body}</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
