"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function toPersianDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/** Adds `is-visible` once the element scrolls into view (once = stays visible). */
function useInView<T extends HTMLElement>(
  options?: IntersectionObserverInit & { once?: boolean }
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (options?.once !== false) observer.disconnect();
        } else if (options?.once === false) {
          setInView(false);
        }
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? "0px 0px -10% 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options?.once, options?.threshold, options?.rootMargin]);

  return { ref, inView };
}

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Stagger delay in ms. */
  delay?: number;
  id?: string;
};

/** Fade + slide-up reveal driven by IntersectionObserver. */
export function Reveal({
  children,
  as,
  className,
  delay = 0,
  id,
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <Tag
      ref={ref}
      id={id}
      className={cn("lp-reveal", inView && "is-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

type AnimatedCounterProps = {
  to: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

/** Counts up to `to` (Persian digits) when scrolled into view. */
export function AnimatedCounter({
  to,
  durationMs = 1600,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setValue(to);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, durationMs]);

  const display = toPersianDigits(value.toFixed(decimals));

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

type RotatingWordsProps = {
  words: string[];
  intervalMs?: number;
  className?: string;
};

/** Cycles through words with a fade/slide transition. */
export function RotatingWords({
  words,
  intervalMs = 2200,
  className,
}: RotatingWordsProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [words.length, intervalMs]);

  return (
    <span className="relative inline-grid">
      {words.map((word, i) => (
        <span
          key={word}
          aria-hidden={i !== index}
          className={cn(
            "col-start-1 row-start-1 transition-all duration-500",
            className,
            i === index
              ? "opacity-100 translate-y-0 blur-0"
              : "opacity-0 translate-y-3 blur-sm pointer-events-none"
          )}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
