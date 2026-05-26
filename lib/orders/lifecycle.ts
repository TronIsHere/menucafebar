export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  source: "customer" | "waiter";
  isPaid?: boolean;
  tableNumber?: string;
  customerName?: string;
  note?: string;
  createdAt: string;
}

export const ACTIVE_STATUSES: OrderStatus[] = ["pending", "preparing", "ready"];

export const lifecycleColumns = [
  {
    status: "pending" as const,
    label: "جدید",
    nextStatus: "preparing" as const,
    nextLabel: "شروع آماده‌سازی",
    color: "border-t-orange-400",
  },
  {
    status: "preparing" as const,
    label: "در حال آماده‌سازی",
    nextStatus: "ready" as const,
    nextLabel: "آماده تحویل",
    color: "border-t-blue-400",
  },
  {
    status: "ready" as const,
    label: "آماده تحویل",
    nextStatus: "completed" as const,
    nextLabel: "تحویل داده شد",
    color: "border-t-green-400",
  },
];

export const statusLabels: Record<OrderStatus, string> = {
  pending: "جدید",
  preparing: "در حال آماده‌سازی",
  ready: "آماده تحویل",
  completed: "تحویل داده شد",
  cancelled: "لغو شده",
};

export function getNextStatus(status: OrderStatus): OrderStatus | null {
  const col = lifecycleColumns.find((c) => c.status === status);
  return col?.nextStatus ?? null;
}

export function getNextAction(status: OrderStatus): { status: OrderStatus; label: string } | null {
  const col = lifecycleColumns.find((c) => c.status === status);
  if (!col) return null;
  return { status: col.nextStatus, label: col.nextLabel };
}

export function formatToman(n: number) {
  return new Intl.NumberFormat("fa-IR").format(n) + " تومان";
}

export function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff} ثانیه پیش`;
  if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`;
  return `${Math.floor(diff / 3600)} ساعت پیش`;
}

export function normalizeOrder(raw: Order): Order {
  return {
    ...raw,
    _id: String(raw._id),
    createdAt:
      typeof raw.createdAt === "string"
        ? raw.createdAt
        : new Date(raw.createdAt).toISOString(),
  };
}
