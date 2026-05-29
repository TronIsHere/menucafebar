"use client";

import {
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

function pathTransition(id: number): Transition {
  return {
    duration: 20 + (id % 10),
    repeat: Number.POSITIVE_INFINITY,
    ease: "linear",
  };
}

/** Warm coffee orange — matches landing `lp-gradient-text` palette */
const PATH_STROKE = "hsl(25 95% 48%)";

function FloatingPaths({ position }: { position: number }) {
  const reduced = useReducedMotion();

  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 1.2 + i * 0.05,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <svg
        className="h-full w-full"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <title>Background paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={PATH_STROKE}
            strokeWidth={path.width}
            strokeOpacity={0.35 + path.id * 0.012}
            initial={
              reduced
                ? { pathLength: 1, opacity: 0.5 }
                : { pathLength: 0, opacity: 0.5 }
            }
            animate={
              reduced
                ? { pathLength: 1, opacity: 0.5 }
                : {
                    pathLength: 1,
                    opacity: [0.45, 0.9, 0.45],
                    pathOffset: [0, 1, 0],
                  }
            }
            transition={reduced ? undefined : pathTransition(path.id)}
          />
        ))}
      </svg>
    </div>
  );
}

/** Animated SVG path backdrop for hero sections (warm coffee theme). */
export function HeroPathsBackdrop({ className }: { className?: string }) {
  return (
    <div
      data-hero-paths
      className={cn("absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(28 95% 60% / 0.22), transparent 70%)",
        }}
      />
    </div>
  );
}

type AnimatedLettersProps = {
  text: string;
  className?: string;
  wordDelay?: number;
};

/**
 * Word-by-word spring reveal. Persian/Arabic must stay in whole words —
 * per-letter `inline-block` breaks cursive joining (کافه‌ات → ک اف ه‌ات).
 */
export function AnimatedLetters({
  text,
  className,
  wordDelay = 0,
}: AnimatedLettersProps) {
  const reduced = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <span key={`${wordDelay}-${wordIndex}`}>
          {wordIndex > 0 && "\u00A0"}
          <motion.span
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: wordDelay + wordIndex * 0.12,
              type: "spring",
              stiffness: 150,
              damping: 25,
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

type BackgroundPathsProps = {
  children?: ReactNode;
  className?: string;
};

/**
 * Full-bleed section wrapper with animated path backdrop.
 * Pass `children` for custom hero content (landing page uses this).
 */
export function BackgroundPaths({ children, className }: BackgroundPathsProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-muted/20",
        className
      )}
    >
      <HeroPathsBackdrop />
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : 1.2 }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
