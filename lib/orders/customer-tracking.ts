import type { OrderStatus } from "./lifecycle";

export interface CustomerOrderView {
  _id: string;
  status: OrderStatus;
  items: { name: string; quantity: number; note?: string }[];
  total: number;
  tableNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export const customerTrackingSteps: {
  status: OrderStatus;
  label: string;
}[] = [
  { status: "pending", label: "ثبت سفارش" },
  { status: "preparing", label: "آماده‌سازی" },
  { status: "ready", label: "آماده تحویل" },
  { status: "completed", label: "تحویل داده شد" },
];

export const customerStatusMessages: Record<OrderStatus, string> = {
  pending: "سفارش شما ثبت شد و به آشپزخانه ارسال می‌شود.",
  preparing: "آشپزخانه در حال آماده‌سازی سفارش شماست.",
  ready: "سفارش شما آماده است! گارسون به زودی آن را تحویل می‌دهد.",
  completed: "سفارش شما تحویل داده شد. نوش جان!",
  cancelled: "متأسفانه سفارش شما لغو شده است.",
};

const stepIndex: Record<OrderStatus, number> = {
  pending: 0,
  preparing: 1,
  ready: 2,
  completed: 3,
  cancelled: -1,
};

export function getTrackingStepIndex(status: OrderStatus): number {
  return stepIndex[status];
}

export function toCustomerOrderView(order: Record<string, unknown>): CustomerOrderView {
  const items = (order.items as Array<{ name: string; quantity: number; note?: string }>) ?? [];

  return {
    _id: String(order._id),
    status: order.status as OrderStatus,
    items: items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      note: item.note,
    })),
    total: order.total as number,
    tableNumber: order.tableNumber as string | undefined,
    createdAt:
      typeof order.createdAt === "string"
        ? order.createdAt
        : new Date(order.createdAt as Date).toISOString(),
    updatedAt:
      typeof order.updatedAt === "string"
        ? order.updatedAt
        : new Date(order.updatedAt as Date).toISOString(),
  };
}
