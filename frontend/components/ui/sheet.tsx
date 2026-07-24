"use client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect } from "react";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "left" | "right";
}

export function Sheet({ open, onOpenChange, children, side = "left" }: SheetProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "absolute top-0 flex h-full w-[min(18rem,85vw)] flex-col border-border bg-card shadow-2xl",
          side === "left" ? "left-0 border-r" : "right-0 border-l"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function SheetHeader({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-4">
      {children}
      {onClose && (
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function SheetContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 flex-col overflow-y-auto p-3">{children}</div>;
}
