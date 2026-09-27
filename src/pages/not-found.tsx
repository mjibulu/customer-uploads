import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand";

export default function NotFound() {
  return (
    <div className="page-glow flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <Brand />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-2 text-muted-foreground">Check the address, or start from the home page.</p>
      </div>
      <Button asChild>
        <Link href="/">Go to home page</Link>
      </Button>
    </div>
  );
}
