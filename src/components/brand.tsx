import { Link } from "wouter";
import { Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm", className)}>
      <Paperclip className="h-4 w-4 -rotate-45" aria-hidden />
    </span>
  );
}

export function Brand({ href = "/", suffix }: { href?: string; suffix?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 shrink-0" aria-label="Attach home">
      <BrandMark />
      <span className="font-display text-xl font-semibold tracking-tight">Attach</span>
      {suffix && <span className="hidden sm:inline text-sm text-muted-foreground">{suffix}</span>}
    </Link>
  );
}
