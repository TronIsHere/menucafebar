import { Badge } from "@/components/ui/badge";
import {
  TICKET_CATEGORY_LABELS,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
  type TicketCategory,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/support/constants";
import { cn } from "@/lib/utils";

const statusVariants: Record<TicketStatus, "default" | "secondary" | "destructive" | "outline"> = {
  open: "default",
  in_progress: "secondary",
  waiting: "outline",
  resolved: "secondary",
  closed: "outline",
};

const priorityColors: Record<TicketPriority, string> = {
  low: "text-muted-foreground",
  normal: "text-foreground",
  high: "text-orange-600",
  urgent: "text-destructive font-semibold",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <Badge variant={statusVariants[status]}>
      {TICKET_STATUS_LABELS[status]}
    </Badge>
  );
}

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={cn("text-xs", priorityColors[priority])}>
      {TICKET_PRIORITY_LABELS[priority]}
    </span>
  );
}

export function TicketCategoryLabel({ category }: { category: TicketCategory }) {
  return (
    <span className="text-xs text-muted-foreground">
      {TICKET_CATEGORY_LABELS[category]}
    </span>
  );
}

export function formatTicketNumber(num: number) {
  return `#${num}`;
}
