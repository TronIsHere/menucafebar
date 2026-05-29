"use client";

import Link from "next/link";
import { ArrowLeft } from "@/lib/icons/app-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StickyCtaBarProps = {
  visible: boolean;
  label?: string;
  sublabel?: string;
};

export function StickyCtaBar({
  visible,
  label = "شروع رایگان",
  sublabel = "راه‌اندازی در ۱۰ دقیقه",
}: StickyCtaBarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg shadow-[0_-8px_30px_rgba(0,0,0,0.08)]",
        "transition-transform duration-300 ease-out",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        visible ? "translate-y-0" : "translate-y-full pointer-events-none"
      )}
      aria-hidden={!visible}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="hidden sm:block min-w-0">
          <p className="text-sm font-semibold truncate">{label}</p>
          <p className="text-xs text-muted-foreground">{sublabel}</p>
        </div>
        <Button
          size="lg"
          className="lp-shine-wrap gap-2 w-full sm:w-auto cursor-pointer shadow-lg shadow-primary/20"
          asChild
        >
          <Link href="/login">
            {label}
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
