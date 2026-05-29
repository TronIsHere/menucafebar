"use client";

import Link from "next/link";
import { useCallback, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableStatusGrid } from "@/components/tables/TablePicker";
import { useOrdersLive } from "@/hooks/useOrdersLive";
import {
  type Order,
  formatToman,
  lifecycleColumns,
  timeAgo,
} from "@/lib/orders/lifecycle";
import {
  Banknote,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  Clock,
  LayoutGrid,
  Receipt,
  ShoppingBag,
  UserCheck,
  Wifi,
  WifiOff,
} from "@/lib/icons/app-icons";
import { cn } from "@/lib/utils";

export type { Order, OrderItem } from "@/lib/orders/lifecycle";

function formatNum(n: number) {
  return new Intl.NumberFormat("fa-IR").format(n);
}

type ChipTone = "orange" | "blue" | "green" | "amber" | "red" | "violet" | "neutral";

const chipTones: Record<ChipTone, string> = {
  orange:
    "border-orange-400/60 bg-orange-50/50 text-foreground dark:bg-orange-950/10 dark:border-orange-700/50",
  blue: "border-blue-400/60 bg-blue-50/50 text-foreground dark:bg-blue-950/10 dark:border-blue-700/50",
  green:
    "border-green-400/60 bg-green-50/50 text-foreground dark:bg-green-950/10 dark:border-green-700/50",
  amber:
    "border-amber-400/60 bg-amber-50/50 text-foreground dark:bg-amber-950/10 dark:border-amber-700/50",
  red: "border-red-400/60 bg-red-50/50 text-foreground dark:bg-red-950/10 dark:border-red-700/50",
  violet:
    "border-violet-400/60 bg-violet-50/50 text-foreground dark:bg-violet-950/10 dark:border-violet-700/50",
  neutral: "border-border bg-muted/30 text-foreground",
};

function StatusChip({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: ChipTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        chipTones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const columnMeta = [
  {
    ...lifecycleColumns[0],
    icon: Clock,
    chipTone: "orange" as const,
    accent: "border-s-orange-400",
    iconColor: "text-orange-600",
    iconBorder: "border-orange-300/60 dark:border-orange-800",
    headerBg: "bg-orange-50/35 dark:bg-orange-950/10",
    headerBorder: "border-orange-400/50",
    topAccent: "border-t-orange-400/70",
  },
  {
    ...lifecycleColumns[1],
    icon: ChefHat,
    chipTone: "blue" as const,
    accent: "border-s-blue-400",
    iconColor: "text-blue-600",
    iconBorder: "border-blue-300/60 dark:border-blue-800",
    headerBg: "bg-blue-50/35 dark:bg-blue-950/10",
    headerBorder: "border-blue-400/50",
    topAccent: "border-t-blue-400/70",
  },
  {
    ...lifecycleColumns[2],
    icon: CheckCircle2,
    chipTone: "green" as const,
    accent: "border-s-green-400",
    iconColor: "text-green-600",
    iconBorder: "border-green-300/60 dark:border-green-800",
    headerBg: "bg-green-50/35 dark:bg-green-950/10",
    headerBorder: "border-green-400/50",
    topAccent: "border-t-green-400/70",
  },
];

const unpaidColumn = {
  label: "در انتظار پرداخت",
  icon: Receipt,
  chipTone: "amber" as const,
  accent: "border-s-amber-400",
  iconColor: "text-amber-700",
  iconBorder: "border-amber-300/60 dark:border-amber-800",
  headerBg: "bg-amber-50/35 dark:bg-amber-950/10",
  headerBorder: "border-amber-400/50",
  topAccent: "border-t-amber-400/70",
};

function OrderCard({
  order,
  updating,
  onMarkPaid,
  showUnpaidBadge = false,
  primaryAction,
  accent,
}: {
  order: Order;
  updating: boolean;
  onMarkPaid?: (orderId: string) => void;
  showUnpaidBadge?: boolean;
  accent: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    className?: string;
    variant?: "default" | "outline";
  };
}) {
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Card
      className={cn(
        "shadow-sm hover:shadow-md transition-all border-s-4 overflow-hidden",
        accent
      )}
    >
      <CardHeader className="pb-2 pt-3 px-3 sm:px-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                #{order._id.slice(-4).toUpperCase()}
              </span>
              {order.tableNumber ? (
                <span className="text-sm font-semibold">میز {order.tableNumber}</span>
              ) : (
                <span className="text-sm font-semibold">بدون میز</span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {timeAgo(order.createdAt)} · {formatNum(itemCount)} آیتم
            </p>
          </div>
          <span className="text-sm font-bold shrink-0">{formatToman(order.total)}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {order.source === "customer" && (
            <StatusChip tone="blue" className="px-2 py-0.5 text-[11px]">
              QR
            </StatusChip>
          )}
          {order.source === "waiter" && (
            <StatusChip tone="violet" className="px-2 py-0.5 text-[11px]">
              پیشخدمت
            </StatusChip>
          )}
          {(showUnpaidBadge || !order.isPaid) && (
            <StatusChip tone="amber" className="px-2 py-0.5 text-[11px]">
              پرداخت‌نشده
            </StatusChip>
          )}
          {!showUnpaidBadge && order.isPaid && (
            <StatusChip tone="green" className="px-2 py-0.5 text-[11px]">
              پرداخت‌شده
            </StatusChip>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3">
        <ul className="space-y-1.5">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex justify-between gap-2 text-sm">
              <span className="min-w-0 truncate">
                <span className="font-medium">{formatNum(item.quantity)}×</span> {item.name}
                {item.note && (
                  <span className="text-xs text-muted-foreground ms-1">({item.note})</span>
                )}
              </span>
              <span className="text-muted-foreground shrink-0 text-xs">
                {formatToman(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        {order.note && (
          <p className="text-xs bg-amber-50/50 dark:bg-amber-950/10 text-foreground p-2 rounded-md border border-amber-400/50 dark:border-amber-700/50">
            یادداشت: {order.note}
          </p>
        )}
        <div className="flex flex-col gap-2 pt-2 border-t">
          <div className="flex flex-col gap-2 sm:flex-row">
            {onMarkPaid && !order.isPaid && (
              <Button
                size="sm"
                variant={primaryAction ? "outline" : "default"}
                className={cn(
                  "w-full sm:flex-1 gap-1.5 cursor-pointer",
                  !primaryAction && "bg-amber-600 hover:bg-amber-700"
                )}
                disabled={updating}
                onClick={() => onMarkPaid(order._id)}
              >
                <Banknote className="w-4 h-4" />
                {updating ? "در حال ثبت..." : primaryAction ? "پرداخت شد" : "ثبت پرداخت"}
              </Button>
            )}
            {primaryAction && (
              <Button
                size="sm"
                variant={primaryAction.variant ?? "default"}
                className={cn(
                  "w-full sm:flex-1 cursor-pointer",
                  primaryAction.className
                )}
                disabled={updating}
                onClick={primaryAction.onClick}
              >
                {updating ? "در حال ثبت..." : primaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface Props {
  initialOrders: Order[];
  initialUnpaidOrders: Order[];
  tableNumbers: string[];
  initialOccupied: string[];
}

export default function OrderBoard({
  initialOrders,
  initialUnpaidOrders,
  tableNumbers,
  initialOccupied,
}: Props) {
  const [occupiedTables, setOccupiedTables] = useState<string[]>(initialOccupied);
  const [tablesOpen, setTablesOpen] = useState(true);

  const fetchTableStatus = useCallback(async () => {
    if (tableNumbers.length === 0) return;
    try {
      const res = await fetch("/api/tables");
      if (!res.ok) return;
      const data = await res.json();
      setOccupiedTables(data.occupied ?? []);
    } catch {
      /* ignore */
    }
  }, [tableNumbers.length]);

  const { orders, unpaidOrders, connected, updatingIds, updateStatus, markPaid } =
    useOrdersLive(initialOrders, {
      initialUnpaidOrders,
      notifyNewOrders: true,
      onOrderChange: fetchTableStatus,
    });

  async function handleMarkPaid(orderId: string) {
    await markPaid(orderId);
    await fetchTableStatus();
  }

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;
  const activeTotal = orders.length;
  const unpaidCount = unpaidOrders.length;

  const summaryChips: { label: string; count: number; tone: ChipTone }[] = [
    { label: "جدید", count: pendingCount, tone: "orange" },
    { label: "آماده‌سازی", count: preparingCount, tone: "blue" },
    { label: "آماده تحویل", count: readyCount, tone: "green" },
    { label: "پرداخت‌نشده", count: unpaidCount, tone: "amber" },
  ];

  const columns = [
    ...columnMeta.map((col) => ({
      ...col,
      orders: orders.filter((o) => o.status === col.status),
      type: "active" as const,
    })),
    {
      ...unpaidColumn,
      status: "unpaid" as const,
      orders: unpaidOrders,
      type: "unpaid" as const,
      nextStatus: undefined,
      nextLabel: undefined,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {summaryChips.map((chip) => (
            <StatusChip key={chip.label} tone={chip.tone}>
              <span>{chip.label}</span>
              <span className="font-bold tabular-nums">{formatNum(chip.count)}</span>
            </StatusChip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip tone={connected ? "green" : "red"}>
            {connected ? (
              <>
                <Wifi className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">متصل — به‌روزرسانی آنی</span>
                <span className="sm:hidden">آنلاین</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 shrink-0" />
                اتصال مجدد...
              </>
            )}
          </StatusChip>
          <Button size="sm" variant="outline" className="cursor-pointer gap-1.5" asChild>
            <Link href="/waiter">
              <UserCheck className="w-3.5 h-3.5" />
              پیشخدمت
            </Link>
          </Button>
          {tableNumbers.length > 0 && (
            <Button size="sm" variant="outline" className="cursor-pointer gap-1.5" asChild>
              <Link href="/dashboard/floor">
                <LayoutGrid className="w-3.5 h-3.5" />
                نقشه سالن
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Table status — collapsible */}
      {tableNumbers.length > 0 && (
        <Card>
          <button
            type="button"
            onClick={() => setTablesOpen((o) => !o)}
            className="flex w-full cursor-pointer items-center justify-between gap-2 p-4 text-right"
          >
            <div className="flex items-center gap-2 min-w-0">
              <LayoutGrid className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium text-foreground">وضعیت میزها</span>
              <StatusChip tone="neutral" className="px-2 py-0.5 text-[11px]">
                {formatNum(tableNumbers.length - occupiedTables.length)} خالی
              </StatusChip>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform shrink-0",
                tablesOpen && "rotate-180"
              )}
            />
          </button>
          {tablesOpen && (
            <CardContent className="pt-0 pb-4 px-4">
              <TableStatusGrid tableNumbers={tableNumbers} occupied={occupiedTables} />
            </CardContent>
          )}
        </Card>
      )}

      {/* Empty state — all clear */}
      {activeTotal === 0 && unpaidCount === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center px-4">
            <ShoppingBag className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium">سفارش فعالی نیست</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              سفارش‌های جدید از QR منو یا حالت پیشخدمت اینجا نمایش داده می‌شوند
            </p>
            <Button size="sm" className="mt-4 cursor-pointer gap-1.5" asChild>
              <Link href="/waiter">
                ثبت سفارش دستی
                <UserCheck className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-2 xl:grid-cols-4 md:overflow-visible md:pb-0">
        {columns.map((col) => (
          <div
            key={col.status}
            className="flex flex-col gap-3 min-w-[min(100%,280px)] w-[85vw] sm:w-[320px] shrink-0 snap-start md:min-w-0 md:w-auto md:shrink"
          >
            <div
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl border border-t-4",
                col.headerBg,
                col.headerBorder,
                col.topAccent
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center justify-center rounded-lg border p-1.5 bg-background",
                  col.iconBorder
                )}
              >
                <col.icon className={cn("w-4 h-4", col.iconColor)} />
              </span>
              <span className="font-semibold text-sm text-foreground">{col.label}</span>
              <StatusChip tone={col.chipTone} className="ms-auto min-w-[1.75rem] justify-center px-2 py-0.5">
                {formatNum(col.orders.length)}
              </StatusChip>
            </div>

            <ScrollArea className="h-auto max-h-none md:h-[calc(100vh-340px)] md:min-h-[200px]">
              <div className="space-y-3 pe-1 pb-2">
                {col.orders.length === 0 ? (
                  <div className="rounded-xl border border-dashed bg-muted/20 py-8 px-3 text-center">
                    <p className="text-xs text-muted-foreground">سفارشی در این مرحله نیست</p>
                  </div>
                ) : (
                  col.orders.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      accent={col.accent}
                      updating={updatingIds.has(order._id)}
                      showUnpaidBadge={col.type === "unpaid"}
                      onMarkPaid={
                        col.type === "unpaid" || (order.tableNumber && !order.isPaid)
                          ? handleMarkPaid
                          : undefined
                      }
                      primaryAction={
                        col.type === "active"
                          ? {
                              label: col.nextLabel!,
                              onClick: () => updateStatus(order._id, col.nextStatus!),
                              className:
                                col.status === "ready"
                                  ? "bg-green-600 hover:bg-green-700"
                                  : undefined,
                            }
                          : undefined
                      }
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
}
