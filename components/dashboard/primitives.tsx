"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { Card, CardContent } from "@/components/ui/card";

type IconComponent = ComponentType<{ className?: string }>;
import { TrendingDown, TrendingUp, Minus } from "@/lib/icons/app-icons";
import { cn } from "@/lib/utils";
import { formatNum } from "./format";

export function IconChip({
  icon: Icon,
  color,
  border,
  className,
}: {
  icon: IconComponent;
  color: string;
  border: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-xl border bg-transparent",
        border,
        className
      )}
    >
      <Icon className={cn("w-4 h-4", color)} />
    </span>
  );
}

export function TrendBadge({
  trend,
  label,
  compact,
}: {
  trend?: number | null;
  label?: string;
  compact?: boolean;
}) {
  if (trend == null) return null;

  if (trend === 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-0.5 text-muted-foreground",
          compact
            ? "text-[11px]"
            : "rounded-full border border-border px-1.5 py-0.5 text-xs"
        )}
      >
        <Minus className="w-3 h-3" />
        {label ?? "بدون تغییر"}
      </span>
    );
  }

  const isUp = trend > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 font-medium",
        compact ? "text-[11px]" : "rounded-full border px-1.5 py-0.5 text-xs",
        isUp
          ? compact
            ? "text-emerald-600"
            : "border-emerald-300 text-emerald-600 dark:border-emerald-800"
          : compact
            ? "text-red-500"
            : "border-red-300 text-red-500 dark:border-red-900"
      )}
    >
      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {formatNum(Math.abs(trend))}٪ {label ?? (compact ? "نسبت به دیروز" : "")}
    </span>
  );
}

export function DashboardStatCard({
  title,
  value,
  icon: Icon,
  color,
  border,
  href,
  trend,
  trendLabel,
  highlight,
  className,
}: {
  title: string;
  value: string;
  icon: IconComponent;
  color: string;
  border: string;
  href?: string;
  trend?: number | null;
  trendLabel?: string;
  highlight?: boolean;
  className?: string;
}) {
  const content = (
    <Card
      className={cn(
        "h-full transition-all duration-200 hover:shadow-md hover:border-primary/30",
        href && "cursor-pointer",
        highlight && "border-orange-300 dark:border-orange-800",
        className
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <IconChip icon={Icon} color={color} border={border} className="p-2" />
          {highlight && value !== "۰" && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
          )}
        </div>
        <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug line-clamp-2">
          {title}
        </p>
        <p className="text-lg sm:text-2xl font-bold mt-1 truncate">{value}</p>
        {(trend != null || trendLabel) && (
          <div className="mt-2">
            <TrendBadge trend={trend} label={trendLabel} compact />
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="group block min-w-0">
        {content}
      </Link>
    );
  }

  return content;
}

export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: IconComponent;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Icon className="w-10 h-10 text-muted-foreground/40 mb-3" />
      <p className="text-sm font-medium">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function DashboardAlertBanner({
  title,
  message,
  action,
  variant = "amber",
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
  variant?: "amber" | "red" | "blue";
}) {
  const styles = {
    amber: {
      box: "border-amber-400/70 bg-amber-50/60 dark:bg-amber-950/10 dark:border-amber-700/80",
      title: "text-foreground",
      message: "text-muted-foreground",
    },
    red: {
      box: "border-red-300 bg-red-50/60 dark:bg-red-950/10 dark:border-red-800",
      title: "text-foreground",
      message: "text-muted-foreground",
    },
    blue: {
      box: "border-blue-300 bg-blue-50/60 dark:bg-blue-950/10 dark:border-blue-800",
      title: "text-foreground",
      message: "text-muted-foreground",
    },
  };

  const tone = styles[variant];

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
        tone.box
      )}
    >
      <div className="min-w-0">
        <p className={cn("text-sm font-semibold", tone.title)}>{title}</p>
        <p className={cn("text-sm mt-0.5", tone.message)}>{message}</p>
      </div>
      {action && <div className="shrink-0 w-full sm:w-auto">{action}</div>}
    </div>
  );
}

export function DashboardSectionTabs({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-1 p-1 bg-muted rounded-xl w-full sm:w-fit",
        className
      )}
    >
      {children}
    </div>
  );
}
