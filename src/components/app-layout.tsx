import { Link, useLocation } from "wouter";
import { ChevronRight, LogOut } from "lucide-react";
import { Brand } from "@/components/brand";
import { DemoBar } from "@/components/demo-bar";
import { clearAdvisorCode, getAdvisorCode } from "@/lib/auth";

interface Crumb {
  label: string;
  href?: string;
}

interface AppLayoutProps {
  children: React.ReactNode;
  /** Last crumb is the current page. */
  crumbs?: Crumb[];
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const maxWidthClass = {
  sm: "max-w-xl",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};

const NAV = [
  { href: "/portal/new-link", label: "New link" },
  { href: "/portal/direct-upload", label: "Direct upload" },
  { href: "/portal/history", label: "History" },
  { href: "/portal/search", label: "Search" },
];

export function AppLayout({ children, crumbs, maxWidth = "lg" }: AppLayoutProps) {
  const [location, navigate] = useLocation();
  const advisorCode = getAdvisorCode();

  function signOut() {
    clearAdvisorCode();
    navigate("/login");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DemoBar />
      <header className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Brand href="/portal" suffix="Staff workspace" />
          <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Workspace">
            {NAV.map((item) => (
              <NavLink key={item.href} {...item} current={location} />
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {advisorCode && <span className="hidden font-mono text-xs text-muted-foreground lg:inline">{advisorCode}</span>}
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t px-3 py-2 md:hidden" aria-label="Workspace">
          {NAV.map((item) => (
            <NavLink key={item.href} {...item} current={location} />
          ))}
        </nav>

        {crumbs && crumbs.length > 0 && (
          <div className="border-t bg-muted/40">
            <div className={`${maxWidthClass[maxWidth]} mx-auto flex h-9 items-center gap-1.5 overflow-hidden px-4 sm:px-6`}>
              <Link href="/portal" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                Home
              </Link>
              {crumbs.map((c, i) => (
                <span key={i} className="flex min-w-0 items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" aria-hidden />
                  {c.href ? (
                    <Link href={c.href} className="truncate text-xs text-muted-foreground transition-colors hover:text-foreground">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="truncate text-xs font-medium">{c.label}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className={`${maxWidthClass[maxWidth]} mx-auto`}>{children}</div>
      </main>
    </div>
  );
}

function NavLink({ href, current, label }: { href: string; current: string; label: string }) {
  const active = current.startsWith(href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}
