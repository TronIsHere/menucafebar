"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { RefreshCw } from "@/lib/icons/app-icons";
import { cn } from "@/lib/utils";

const MIN_VISIBLE_MS = 220;
const MAX_PENDING_MS = 12_000;

function isDashboardNavigation(href: string, pathname: string, search: string) {
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return false;
    if (!url.pathname.startsWith("/dashboard")) return false;
    const target = `${url.pathname}${url.search}`;
    const current = `${pathname}${search ? `?${search}` : ""}`;
    return target !== current;
  } catch {
    return false;
  }
}

export function DashboardNavOverlay({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  const [pending, setPending] = useState(false);
  const pendingSince = useRef<number | null>(null);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPending = useCallback(() => {
    if (stopTimer.current) {
      clearTimeout(stopTimer.current);
      stopTimer.current = null;
    }
    pendingSince.current = Date.now();
    setPending(true);
  }, []);

  const stopPending = useCallback(() => {
    const elapsed = pendingSince.current ? Date.now() - pendingSince.current : MIN_VISIBLE_MS;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    if (stopTimer.current) clearTimeout(stopTimer.current);
    stopTimer.current = setTimeout(() => {
      setPending(false);
      pendingSince.current = null;
      stopTimer.current = null;
    }, remaining);
  }, []);

  // Navigation finished
  useEffect(() => {
    stopPending();
  }, [pathname, search, stopPending]);

  // Link clicks within the dashboard
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (anchor.target && anchor.target !== "_self") return;

      if (isDashboardNavigation(href, pathname, search)) {
        startPending();
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, search, startPending]);

  // Browser back / forward
  useEffect(() => {
    const onPopState = () => startPending();
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [startPending]);

  // Safety net if navigation is cancelled or stalls
  useEffect(() => {
    if (!pending) return;
    const timeout = setTimeout(() => setPending(false), MAX_PENDING_MS);
    return () => clearTimeout(timeout);
  }, [pending]);

  useEffect(() => {
    return () => {
      if (stopTimer.current) clearTimeout(stopTimer.current);
    };
  }, []);

  return (
    <div className="relative min-h-full">
      <div
        className={cn(
          "min-h-full transition-[filter,opacity] duration-200",
          pending && "pointer-events-none select-none blur-[2px] opacity-80"
        )}
      >
        {children}
      </div>

      <div
        className={cn(
          "absolute inset-0 z-50 flex items-start justify-center pt-[18vh] sm:pt-[22vh]",
          "bg-background/20 backdrop-blur-[2px]",
          "transition-opacity duration-200",
          pending ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!pending}
        aria-live="polite"
      >
        <div className="flex items-center gap-2.5 rounded-full border border-border/80 bg-background/95 px-4 py-2.5 shadow-lg">
          <RefreshCw className="w-4 h-4 animate-spin text-primary shrink-0" />
          <span className="text-sm font-medium text-foreground">در حال بارگذاری...</span>
        </div>
      </div>
    </div>
  );
}
