"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useOrdersLive } from "@/hooks/useOrdersLive";
import {
  type Order,
  formatToman,
  getNextAction,
  statusLabels,
  timeAgo,
} from "@/lib/orders/lifecycle";
import {
  buildFloorStates,
  countFloorStatuses,
  type TableFloorStatus,
} from "@/lib/tables/floor-status";
import { cn } from "@/lib/utils";
import {
  Banknote,
  CheckCircle2,
  ChefHat,
  CircleDot,
  Clock,
  Sparkles,
  Timer,
  UtensilsCrossed,
  WifiOff,
} from "lucide-react";

const statusConfig: Record<
  TableFloorStatus,
  {
    label: string;
    dot: string;
    ring: string;
    surface: string;
    tableText: string;
    chair: string;
    glow?: string;
    pulse?: boolean;
    statCard: string;
    statCount: string;
    statIcon: string;
    sheetBanner: string;
    sheetBadge: string;
    tableNumBadge: string;
  }
> = {
  free: {
    label: "خالی",
    dot: "bg-emerald-500",
    ring: "ring-emerald-400/40",
    surface: "from-emerald-50 to-emerald-100/80 border-emerald-200/80",
    tableText: "text-emerald-800",
    chair: "bg-emerald-400/50",
    statCard: "bg-emerald-50 border-emerald-200",
    statCount: "text-emerald-700",
    statIcon: "text-emerald-500",
    sheetBanner: "from-emerald-50 to-emerald-100/60 border-emerald-200/60",
    sheetBadge: "border-emerald-300 bg-emerald-100 text-emerald-700",
    tableNumBadge: "bg-emerald-200/70 text-emerald-800",
  },
  ordering: {
    label: "در حال سفارش",
    dot: "bg-amber-500",
    ring: "ring-amber-400/50",
    surface: "from-amber-50 to-orange-100/90 border-amber-300/80",
    tableText: "text-amber-900",
    chair: "bg-amber-400/60",
    pulse: true,
    statCard: "bg-amber-50 border-amber-200",
    statCount: "text-amber-700",
    statIcon: "text-amber-500",
    sheetBanner: "from-amber-50 to-orange-100/60 border-amber-200/60",
    sheetBadge: "border-amber-300 bg-amber-100 text-amber-800",
    tableNumBadge: "bg-amber-200/70 text-amber-900",
  },
  ready: {
    label: "آماده تحویل",
    dot: "bg-violet-500",
    ring: "ring-violet-400/50",
    surface: "from-violet-50 to-purple-100/90 border-violet-300/80",
    tableText: "text-violet-900",
    chair: "bg-violet-400/60",
    glow: "shadow-[0_0_20px_rgba(139,92,246,0.30)]",
    statCard: "bg-violet-50 border-violet-200",
    statCount: "text-violet-700",
    statIcon: "text-violet-500",
    sheetBanner: "from-violet-50 to-purple-100/60 border-violet-200/60",
    sheetBadge: "border-violet-300 bg-violet-100 text-violet-800",
    tableNumBadge: "bg-violet-200/70 text-violet-900",
  },
  awaiting_payment: {
    label: "در انتظار پرداخت",
    dot: "bg-rose-500",
    ring: "ring-rose-400/50",
    surface: "from-rose-50 to-red-100/90 border-rose-300/80",
    tableText: "text-rose-900",
    chair: "bg-rose-400/60",
    pulse: true,
    statCard: "bg-rose-50 border-rose-200",
    statCount: "text-rose-700",
    statIcon: "text-rose-500",
    sheetBanner: "from-rose-50 to-red-100/60 border-rose-200/60",
    sheetBadge: "border-rose-300 bg-rose-100 text-rose-800",
    tableNumBadge: "bg-rose-200/70 text-rose-900",
  },
};

interface Props {
  initialOrders: Order[];
  initialUnpaidOrders: Order[];
  tableNumbers: string[];
}

function StatCard({
  status,
  count,
  total,
}: {
  status: TableFloorStatus;
  count: number;
  total: number;
}) {
  const config = statusConfig[status];
  const icons = {
    free: CheckCircle2,
    ordering: UtensilsCrossed,
    ready: Sparkles,
    awaiting_payment: Banknote,
  };
  const Icon = icons[status];

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3 flex-1 min-w-0",
        config.statCard
      )}
    >
      <Icon className={cn("w-5 h-5 shrink-0", config.statIcon)} />
      <div className="min-w-0">
        <p className={cn("text-2xl font-bold leading-none tabular-nums", config.statCount)}>
          {count}
          <span className="text-xs font-normal text-muted-foreground ms-1">/ {total}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{config.label}</p>
      </div>
    </div>
  );
}

function TableTile({
  number,
  status,
  order,
  selected,
  onSelect,
}: {
  number: string;
  status: TableFloorStatus;
  order?: Order;
  selected: boolean;
  onSelect: () => void;
}) {
  const config = statusConfig[status];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col items-center gap-2 rounded-2xl p-2.5 transition-all duration-300",
        "hover:scale-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        selected && "scale-[1.05] ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      <div
        className={cn(
          "relative w-full max-w-[108px] aspect-square mx-auto",
          config.pulse && "animate-[pulse_2.5s_ease-in-out_infinite]"
        )}
      >
        {/* Top chair */}
        <span
          className={cn(
            "absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-[14%] rounded-t-xl",
            config.chair
          )}
        />
        {/* Bottom chair */}
        <span
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 w-[30%] h-[14%] rounded-b-xl",
            config.chair
          )}
        />
        {/* Left chair */}
        <span
          className={cn(
            "absolute top-1/2 left-0 -translate-y-1/2 w-[14%] h-[30%] rounded-s-xl",
            config.chair
          )}
        />
        {/* Right chair */}
        <span
          className={cn(
            "absolute top-1/2 right-0 -translate-y-1/2 w-[14%] h-[30%] rounded-e-xl",
            config.chair
          )}
        />

        {/* Table surface */}
        <div
          className={cn(
            "absolute inset-[18%] rounded-xl border-2 bg-linear-to-br",
            "flex flex-col items-center justify-center gap-0.5",
            "transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.03]",
            "ring-2",
            config.surface,
            config.ring,
            config.glow
          )}
        >
          <span className={cn("text-base font-bold leading-none", config.tableText)}>
            {number}
          </span>
          {order && (
            <span className={cn("text-[9px] font-medium opacity-70", config.tableText)}>
              {formatToman(order.total).replace(" تومان", "")}
            </span>
          )}
        </div>

        {/* Ready sparkle */}
        {status === "ready" && (
          <Sparkles className="absolute -top-1.5 -inset-e-1.5 w-4 h-4 text-violet-500 drop-shadow-sm animate-pulse" />
        )}

        {/* Ordering ping dot */}
        {status === "ordering" && (
          <span className="absolute -top-1 -inset-e-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
          </span>
        )}
      </div>

      {/* Status label */}
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium leading-none",
          status === "free" && "bg-emerald-100 text-emerald-700",
          status === "ordering" && "bg-amber-100 text-amber-800",
          status === "ready" && "bg-violet-100 text-violet-800"
        )}
      >
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
        <span className="truncate max-w-[80px]">{config.label}</span>
      </span>

      {/* Elapsed time for active orders */}
      {order && (
        <span className="text-[9px] text-muted-foreground flex items-center gap-0.5 -mt-1">
          <Timer className="w-2.5 h-2.5" />
          {timeAgo(order.createdAt)}
        </span>
      )}
    </button>
  );
}

function TableDetailSheet({
  tableNumber,
  tableStatus,
  order,
  open,
  onOpenChange,
  updating,
  onUpdateStatus,
  onMarkPaid,
}: {
  tableNumber: string | null;
  tableStatus: TableFloorStatus;
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updating: boolean;
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
  onMarkPaid: (orderId: string) => void;
}) {
  if (!tableNumber) return null;

  const nextAction =
    order && tableStatus !== "awaiting_payment"
      ? getNextAction(order.status)
      : null;
  const config = statusConfig[tableStatus];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full sm:max-w-md p-0 overflow-hidden flex flex-col"
      >
        {/* Colored header banner */}
        <div
          className={cn(
            "px-6 pt-6 pb-5 border-b bg-linear-to-br shrink-0",
            config.sheetBanner
          )}
        >
          <SheetHeader className="text-start space-y-2">
            <SheetTitle className="flex items-center gap-2.5 text-xl">
              <span
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold shrink-0",
                  config.tableNumBadge
                )}
              >
                {tableNumber}
              </span>
              <span>میز {tableNumber}</span>
              {order ? (
                <Badge variant="outline" className={cn("ms-auto text-xs", config.sheetBadge)}>
                  {statusLabels[order.status]}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className={cn("ms-auto text-xs", config.sheetBadge)}
                >
                  خالی
                </Badge>
              )}
            </SheetTitle>
            {order && (
              <SheetDescription className="flex items-center gap-3 text-sm">
                <span className="font-mono bg-white/60 px-2 py-0.5 rounded-md text-xs font-semibold border border-black/6">
                  #{order._id.slice(-6).toUpperCase()}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {timeAgo(order.createdAt)}
                </span>
              </SheetDescription>
            )}
          </SheetHeader>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!order && (
            <div className="py-14 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="font-semibold text-base">میز آماده پذیرش</p>
              <p className="text-sm text-muted-foreground">
                سفارش فعالی برای این میز ثبت نشده است.
              </p>
            </div>
          )}

          {order && (
            <div className="space-y-5">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {order.source === "customer" && (
                  <Badge variant="outline" className="text-xs rounded-full">
                    آنلاین
                  </Badge>
                )}
                {order.source === "waiter" && (
                  <Badge variant="secondary" className="text-xs rounded-full">
                    پیشخدمت
                  </Badge>
                )}
                {!order.isPaid && (
                  <Badge variant="destructive" className="text-xs rounded-full">
                    پرداخت نشده
                  </Badge>
                )}
                {order.isPaid && (
                  <Badge
                    variant="outline"
                    className="text-xs rounded-full border-green-300 text-green-700 bg-green-50"
                  >
                    پرداخت شده
                  </Badge>
                )}
              </div>

              {/* Order items */}
              <div className="rounded-xl border border-border/60 overflow-hidden">
                <ul className="divide-y divide-border/60">
                  {order.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between gap-3 text-sm px-4 py-3"
                    >
                      <span className="flex-1 min-w-0">
                        <span className="font-semibold">{item.quantity}×</span>{" "}
                        {item.name}
                        {item.note && (
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            {item.note}
                          </span>
                        )}
                      </span>
                      <span className="text-muted-foreground shrink-0 tabular-nums text-xs pt-0.5">
                        {formatToman(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order note */}
              {order.note && (
                <div className="flex gap-2.5 bg-yellow-50 text-yellow-800 p-3.5 rounded-xl border border-yellow-200 text-sm">
                  <span className="shrink-0 mt-0.5">📝</span>
                  <span>{order.note}</span>
                </div>
              )}

              {/* Total */}
              <div className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3">
                <span className="font-semibold text-sm">جمع کل</span>
                <span className="text-xl font-bold tabular-nums">
                  {formatToman(order.total)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Sticky action footer */}
        {order && (
          <div className="px-6 py-4 border-t bg-background/90 backdrop-blur-sm shrink-0 space-y-2.5">
            {!order.isPaid && (
              <Button
                variant="outline"
                className="w-full gap-2"
                disabled={updating}
                onClick={() => onMarkPaid(order._id)}
              >
                <Banknote className="w-4 h-4" />
                ثبت پرداخت
              </Button>
            )}
            {nextAction && (
              <Button
                className={cn(
                  "w-full gap-2",
                  order.status === "ready" && "bg-green-600 hover:bg-green-700"
                )}
                disabled={updating}
                onClick={() => onUpdateStatus(order._id, nextAction.status)}
              >
                {order.status === "pending" && <ChefHat className="w-4 h-4" />}
                {order.status === "preparing" && <Sparkles className="w-4 h-4" />}
                {order.status === "ready" && <CheckCircle2 className="w-4 h-4" />}
                {updating ? "در حال پردازش..." : nextAction.label}
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default function FloorPlanView({
  initialOrders,
  initialUnpaidOrders,
  tableNumbers,
}: Props) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const { orders, unpaidOrders, connected, updatingIds, updateStatus, markPaid } =
    useOrdersLive(initialOrders, {
      initialUnpaidOrders,
      notifyNewOrders: true,
    });

  const floorStates = useMemo(
    () => buildFloorStates(tableNumbers, orders, unpaidOrders),
    [tableNumbers, orders, unpaidOrders]
  );

  const counts = useMemo(() => countFloorStatuses(floorStates), [floorStates]);

  const selectedState = floorStates.find((s) => s.number === selectedTable);
  const sheetOpen = selectedTable !== null;

  if (tableNumbers.length === 0) {
    return (
      <Card>
        <CardContent className="py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <CircleDot className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <div className="space-y-1.5">
            <p className="font-semibold text-base">میزی تعریف نشده</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              از بخش تنظیمات، شماره میزها را وارد کنید تا نقشه سالن نمایش داده شود.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats + connection indicator */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-3 flex-1 min-w-0">
          {(Object.keys(statusConfig) as TableFloorStatus[]).map((status) => (
            <StatCard
              key={status}
              status={status}
              count={counts[status]}
              total={tableNumbers.length}
            />
          ))}
        </div>

        <div
          className={cn(
            "self-start sm:self-center flex items-center gap-2 text-sm px-3 py-2 rounded-xl border shrink-0",
            connected
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-600"
          )}
        >
          {connected ? (
            <>
              <span className="relative flex w-2.5 h-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              به‌روزرسانی زنده
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              در حال اتصال مجدد...
            </>
          )}
        </div>
      </div>

      {/* Floor canvas */}
      <Card className="overflow-hidden border shadow-md">
        <CardContent className="p-0">
          <div className="relative bg-linear-to-br from-stone-100 via-stone-50 to-amber-50/30 dark:from-stone-900 dark:via-stone-950 dark:to-stone-900">
            {/* Dot grid background */}
            <div
              className="absolute inset-0 opacity-[0.45]"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.14) 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative p-5 sm:p-8 min-h-[440px]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {floorStates.map((state) => (
                  <TableTile
                    key={state.number}
                    number={state.number}
                    status={state.status}
                    order={state.order}
                    selected={selectedTable === state.number}
                    onSelect={() => setSelectedTable(state.number)}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground">
        روی هر میز کلیک کنید تا جزئیات سفارش فعال آن را مشاهده کنید
      </p>

      <TableDetailSheet
        tableNumber={selectedTable}
        tableStatus={selectedState?.status ?? "free"}
        order={selectedState?.order ?? null}
        open={sheetOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedTable(null);
        }}
        updating={
          selectedState?.order ? updatingIds.has(selectedState.order._id) : false
        }
        onUpdateStatus={updateStatus}
        onMarkPaid={markPaid}
      />
    </div>
  );
}
