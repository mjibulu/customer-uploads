import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { FlaskConical, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { resetDemo } from "@/demo/store";

export function DemoBar() {
  const [confirming, setConfirming] = useState(false);

  function handleReset() {
    resetDemo();
    setConfirming(false);
    toast.success("Demo reset");
  }

  return (
    <>
      <div className="bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-1.5 text-xs sm:px-6">
          <FlaskConical className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
          <p className="min-w-0 flex-1 truncate">
            <span className="font-semibold">Demo.</span>
            <span className="hidden opacity-80 sm:inline"> Demo</span>
          </p>
          <Link href="/demo" className="shrink-0 font-medium underline-offset-4 hover:underline">
            Guided tour
          </Link>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex shrink-0 items-center gap-1 font-medium underline-offset-4 hover:underline"
          >
            <RotateCcw className="h-3 w-3" aria-hidden />
            Reset
          </button>
        </div>
      </div>

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Reset demo?</DialogTitle>
            <DialogDescription>Deletes the links, uploads and files you created.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Reset demo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
