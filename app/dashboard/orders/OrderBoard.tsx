"use client";

import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import { Clock, ChefHat, CheckCircle2, Wifi, WifiOff, Banknote, Receipt } from "@/lib/icons/app-icons";

export type { Order, OrderItem } from "@/lib/orders/lifecycle";

const columnMeta = [
  { ...lifecycleColumns[0], icon: Clock, badgeVariant: "default" as const },
  { ...lifecycleColumns[1], icon: ChefHat, badgeVariant: "secondary" as const },
  { ...lifecycleColumns[2], icon: CheckCircle2, badgeVariant: "outline" as const },
];

const unpaidColumn = {
  label: "در انتظار پرداخت",
  icon: Receipt,
  badgeVariant: "outline" as const,
  color: "border-t-amber-400",
};

function OrderCard({
  order,
  updating,
  onMarkPaid,
  showUnpaidBadge = false,
  primaryAction,
}: {
  order: Order;
  updating: boolean;
  onMarkPaid?: (orderId: string) => void;
  showUnpaidBadge?: boolean;
  primaryAction?: {
    label: string;
    onClick: () => void;
    className?: string;
    variant?: "default" | "outline";
  };
}) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
              #{order._id.slice(-4).toUpperCase()}
            </span>
            {order.tableNumber && (
              <span className="text-xs text-muted-foreground">
                میز {order.tableNumber}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {timeAgo(order.createdAt)}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {order.source === "customer" && (
            <Badge variant="outline" className="w-fit text-xs">
              آنلاین
            </Badge>
          )}
          {order.source === "waiter" && (
            <Badge variant="secondary" className="w-fit text-xs">
              پیشخدمت
            </Badge>
          )}
          {(showUnpaidBadge || !order.isPaid) && (
            <Badge variant="destructive" className="w-fit text-xs">
              پرداخت نشده
            </Badge>
          )}
          {!showUnpaidBadge && order.tableNumber && order.isPaid && (
            <Badge
              variant="outline"
              className="w-fit text-xs border-green-300 text-green-700"
            >
              پرداخت شده
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        <ul className="space-y-1">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex justify-between text-sm">
              <span>
                {item.quantity}× {item.name}
                {item.note && (
                  <span className="text-xs text-muted-foreground ms-1">
                    ({item.note})
                  </span>
                )}
              </span>
              <span className="text-muted-foreground shrink-0 ms-2">
                {formatToman(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        {order.note && (
          <p className="text-xs bg-yellow-50 text-yellow-800 p-2 rounded border border-yellow-200">
            یادداشت: {order.note}
          </p>
        )}
        <div className="flex flex-col gap-2 pt-1 border-t">
          <div className="flex items-center justify-between font-bold text-sm">
            <span>جمع کل:</span>
            <span>{formatToman(order.total)}</span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {onMarkPaid && !order.isPaid && (
              <Button
                size="sm"
                variant={primaryAction ? "outline" : "default"}
                className={`w-full sm:flex-1 gap-1 ${
                  !primaryAction ? "bg-amber-600 hover:bg-amber-700" : ""
                }`}
                disabled={updating}
                onClick={() => onMarkPaid(order._id)}
              >
                <Banknote className="w-4 h-4" />
                {primaryAction ? "پرداخت شد" : "ثبت پرداخت در سالن"}
              </Button>
            )}
            {primaryAction && (
              <Button
                size="sm"
                variant={primaryAction.variant ?? "default"}
                className={`w-full sm:flex-1 ${primaryAction.className ?? ""}`}
                disabled={updating}
                onClick={primaryAction.onClick}
              >
                {updating ? "..." : primaryAction.label}
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

  const fetchTableStatus = useCallback(async () => {
    if (tableNumbers.length === 0) return;
    try {
      const res = await fetch("/api/tables");
      if (!res.ok) return;
      const data = await res.json();
      setOccupiedTables(data.occupied ?? []);
    } catch {}
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

  return (
    <div className="space-y-4">
      {tableNumbers.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <TableStatusGrid tableNumbers={tableNumbers} occupied={occupiedTables} />
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-2 text-sm">
        {connected ? (
          <>
            <Wifi className="w-4 h-4 text-green-500 shrink-0" />
            <span className="text-green-600 hidden sm:inline">
              متصل: سفارشات جدید به‌صورت آنی نمایش داده می‌شوند
            </span>
            <span className="text-green-600 sm:hidden">متصل — به‌روزرسانی آنی</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-red-600">در حال اتصال مجدد...</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columnMeta.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.status);
          return (
            <div key={col.status} className="flex flex-col gap-3">
              <div
                className={`flex items-center gap-2 p-3 bg-card rounded-lg border border-t-4 ${col.color}`}
              >
                <col.icon className="w-5 h-5" />
                <span className="font-semibold">{col.label}</span>
                <Badge variant={col.badgeVariant} className="ms-auto">
                  {colOrders.length}
                </Badge>
              </div>

              <ScrollArea className="h-auto max-h-none md:h-[calc(100vh-320px)]">
                <div className="space-y-3 ps-1">
                  {colOrders.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-8">
                      سفارشی موجود نیست
                    </p>
                  )}
                  {colOrders.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      updating={updatingIds.has(order._id)}
                      onMarkPaid={
                        order.tableNumber && !order.isPaid
                          ? handleMarkPaid
                          : undefined
                      }
                      primaryAction={{
                        label: col.nextLabel,
                        onClick: () => updateStatus(order._id, col.nextStatus),
                        className:
                          col.status === "ready"
                            ? "bg-green-600 hover:bg-green-700"
                            : undefined,
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          );
        })}

        <div className="flex flex-col gap-3">
          <div
            className={`flex items-center gap-2 p-3 bg-card rounded-lg border border-t-4 ${unpaidColumn.color}`}
          >
            <unpaidColumn.icon className="w-5 h-5 text-amber-700" />
            <span className="font-semibold">{unpaidColumn.label}</span>
            <Badge
              variant={unpaidColumn.badgeVariant}
              className="ms-auto border-amber-300 text-amber-800"
            >
              {unpaidOrders.length}
            </Badge>
          </div>

          <ScrollArea className="h-auto max-h-none md:h-[calc(100vh-320px)]">
            <div className="space-y-3 ps-1">
              {unpaidOrders.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-8">
                  سفارشی موجود نیست
                </p>
              )}
              {unpaidOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  updating={updatingIds.has(order._id)}
                  showUnpaidBadge
                  onMarkPaid={handleMarkPaid}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
