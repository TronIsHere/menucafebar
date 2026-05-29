"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  printKitchenTicket,
  type KitchenTicketOrder,
  type PaperWidth,
} from "@/lib/print/kitchen-ticket";
import { ChefHat, Printer, Wifi, WifiOff } from "@/lib/icons/app-icons";

interface Order extends KitchenTicketOrder {
  total: number;
  status: string;
}

interface Props {
  cafeName: string;
  autoPrint: boolean;
  paperWidth: PaperWidth;
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff} ثانیه پیش`;
  if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`;
  return `${Math.floor(diff / 3600)} ساعت پیش`;
}

export default function KitchenStation({ cafeName, autoPrint, paperWidth }: Props) {
  const [connected, setConnected] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const printedRef = useRef<Set<string>>(new Set());
  const esRef = useRef<EventSource | null>(null);

  const handlePrint = useCallback(
    (order: KitchenTicketOrder) => {
      printKitchenTicket(order, { cafeName, paperWidth });
    },
    [cafeName, paperWidth]
  );

  const queuePrint = useCallback(
    (order: Order) => {
      if (printedRef.current.has(order._id)) return;
      printedRef.current.add(order._id);
      handlePrint(order);
    },
    [handlePrint]
  );

  useEffect(() => {
    function connect() {
      const es = new EventSource("/api/orders/stream");
      esRef.current = es;

      es.onopen = () => setConnected(true);

      es.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.type === "new_order") {
            const order = payload.order as Order;
            setRecentOrders((prev) => {
              if (prev.some((o) => o._id === order._id)) return prev;
              return [order, ...prev].slice(0, 20);
            });
            if (autoPrint) {
              queuePrint(order);
              toast.success(
                `چاپ شد: ${order.tableNumber ? `میز ${order.tableNumber}` : `#${order._id.slice(-4).toUpperCase()}`}`
              );
            } else {
              toast.info("سفارش جدید — چاپ خودکار خاموش است");
            }
          }
        } catch {}
      };

      es.onerror = () => {
        setConnected(false);
        es.close();
        setTimeout(connect, 3000);
      };
    }

    connect();
    return () => esRef.current?.close();
  }, [autoPrint, queuePrint]);

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <ChefHat className="w-6 h-6" />
            ایستگاه آشپزخانه
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            این صفحه را روی تبلت یا PC متصل به پرینتر حرارتی باز نگه دارید.
            {autoPrint
              ? " سفارشات جدید خودکار چاپ می‌شوند."
              : " چاپ خودکار خاموش است — از تنظیمات فعال کنید."}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => handlePrint(testTicket())}>
          <Printer className="w-4 h-4 ms-1" />
          چاپ تست
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 flex items-center gap-2 text-sm">
          {connected ? (
            <>
              <Wifi className="w-4 h-4 text-green-500 shrink-0" />
              <span className="text-green-600">متصل — در انتظار سفارش جدید</span>
              <Badge variant="outline" className="ms-auto">
                {paperWidth}mm
              </Badge>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-red-600">در حال اتصال مجدد...</span>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/40 border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">راه‌اندازی پرینتر حرارتی</p>
          <p>۱. پرینتر را از USB، بلوتوث یا شبکه به همین دستگاه وصل کنید.</p>
          <p>۲. در تنظیمات سیستم‌عامل، پرینتر را به‌عنوان پیش‌فرض انتخاب کنید.</p>
          <p>۳. عرض کاغذ (۵۸ یا ۸۰ میلی‌متر) را در تنظیمات کافه تنظیم کنید.</p>
          <p>۴. «چاپ تست» را بزنید — اگر درست چاپ شد، آماده‌اید.</p>
        </CardContent>
      </Card>

      {recentOrders.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground">آخرین سفارشات</h2>
          {recentOrders.map((order) => (
            <Card key={order._id}>
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm">#{order._id.slice(-4).toUpperCase()}</span>
                  <span className="text-xs text-muted-foreground">{timeAgo(order.createdAt)}</span>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2">
                {order.tableNumber && (
                  <p className="font-bold">میز {order.tableNumber}</p>
                )}
                <ul className="text-sm space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.quantity}× {item.name}
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full gap-1"
                  onClick={() => handlePrint(order)}
                >
                  <Printer className="w-4 h-4" />
                  چاپ مجدد
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function testTicket(): KitchenTicketOrder {
  return {
    _id: "test0001",
    items: [
      { name: "اسپرسو", quantity: 2 },
      { name: "کیک شکلاتی", quantity: 1, note: "بدون خامه" },
    ],
    tableNumber: "۳",
    source: "waiter",
    createdAt: new Date().toISOString(),
    note: "این یک چاپ تست است",
  };
}
