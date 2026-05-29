"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOrdersLive } from "@/hooks/useOrdersLive";
import {
  type Order,
  formatToman,
  getNextAction,
  lifecycleColumns,
  statusLabels,
  timeAgo,
} from "@/lib/orders/lifecycle";
import { Bell, CheckCircle2, ChefHat, Clock, Wifi, WifiOff } from "@/lib/icons/app-icons";

interface Props {
  liveOrders: ReturnType<typeof useOrdersLive>;
}

const statusIcons = {
  pending: Clock,
  preparing: ChefHat,
  ready: CheckCircle2,
} as const;

export default function WaiterOrderBoard({ liveOrders }: Props) {
  const { orders, connected, updatingIds, updateStatus } = liveOrders;

  const readyOrders = orders.filter((o) => o.status === "ready");
  const otherOrders = orders.filter((o) => o.status !== "ready");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm">
        {connected ? (
          <>
            <Wifi className="w-4 h-4 text-green-500 shrink-0" />
            <span className="text-green-600">متصل — به‌روزرسانی آنی</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-red-600">در حال اتصال مجدد...</span>
          </>
        )}
      </div>

      {readyOrders.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold text-green-700">آماده تحویل</h2>
            <Badge className="bg-green-600">{readyOrders.length}</Badge>
          </div>
          <div className="space-y-3">
            {readyOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                highlight
                updating={updatingIds.has(order._id)}
                onAdvance={(status) => updateStatus(order._id, status)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-semibold text-muted-foreground text-sm">سایر سفارشات فعال</h2>
        <ScrollArea className="max-h-[calc(100vh-280px)]">
          <div className="space-y-3 pe-1">
            {otherOrders.length === 0 && readyOrders.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-12">
                سفارش فعالی وجود ندارد
              </p>
            )}
            {otherOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                updating={updatingIds.has(order._id)}
                onAdvance={(status) => updateStatus(order._id, status)}
              />
            ))}
          </div>
        </ScrollArea>
      </section>
    </div>
  );
}

function OrderCard({
  order,
  highlight = false,
  updating,
  onAdvance,
}: {
  order: Order;
  highlight?: boolean;
  updating: boolean;
  onAdvance: (status: Order["status"]) => void;
}) {
  const next = getNextAction(order.status);
  const StatusIcon = statusIcons[order.status as keyof typeof statusIcons] ?? Clock;
  const col = lifecycleColumns.find((c) => c.status === order.status);

  return (
    <Card
      className={
        highlight
          ? "border-green-400 border-2 shadow-md bg-green-50/30"
          : "shadow-sm"
      }
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                #{order._id.slice(-4).toUpperCase()}
              </span>
              {order.tableNumber && (
                <span className="font-bold text-base">میز {order.tableNumber}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{statusLabels[order.status]}</span>
              <span>·</span>
              <span>{timeAgo(order.createdAt)}</span>
            </div>
          </div>
          {order.source === "customer" && (
            <Badge variant="outline" className="text-xs shrink-0">
              آنلاین
            </Badge>
          )}
        </div>

        <ul className="space-y-0.5">
          {order.items.map((item, idx) => (
            <li key={idx} className="text-sm flex justify-between gap-2">
              <span>
                {item.quantity}× {item.name}
              </span>
              <span className="text-muted-foreground shrink-0">
                {formatToman(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        {order.note && (
          <p className="text-xs bg-yellow-50 text-yellow-800 p-2 rounded border border-yellow-200">
            {order.note}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t font-bold text-sm">
          <span>جمع:</span>
          <span>{formatToman(order.total)}</span>
        </div>

        {next && (
          <Button
            size="lg"
            className={`w-full ${col?.status === "ready" ? "bg-green-600 hover:bg-green-700" : ""}`}
            disabled={updating}
            onClick={() => onAdvance(next.status)}
          >
            {updating ? "..." : next.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
