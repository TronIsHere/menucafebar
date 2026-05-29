import { cn } from "@/lib/utils";

type PageSize = "default" | "narrow" | "full";

const sizeClasses: Record<PageSize, string> = {
  default: "max-w-7xl",
  narrow: "max-w-2xl",
  full: "max-w-[1400px]",
};

export function DashboardPage({
  children,
  size = "default",
  className,
}: {
  children: React.ReactNode;
  size?: PageSize;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "p-4 sm:p-6 mx-auto space-y-5 sm:space-y-6",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}

export function DashboardPageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-sm text-muted-foreground mb-1">{eyebrow}</p>
        )}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}
