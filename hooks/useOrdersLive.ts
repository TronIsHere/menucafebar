"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  type Order,
  type OrderStatus,
  formatToman,
  normalizeOrder,
} from "@/lib/orders/lifecycle";

interface Options {
  notifyNewOrders?: boolean;
  onOrderChange?: () => void;
  initialUnpaidOrders?: Order[];
}

function upsertOrder(list: Order[], order: Order): Order[] {
  const exists = list.some((o) => o._id === order._id);
  if (exists) {
    return list.map((o) => (o._id === order._id ? order : o));
  }
  return [order, ...list];
}

export function useOrdersLive(initialOrders: Order[], options: Options = {}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [unpaidOrders, setUnpaidOrders] = useState<Order[]>(
    options.initialUnpaidOrders ?? []
  );
  const [connected, setConnected] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const esRef = useRef<EventSource | null>(null);

  const applyOrderUpdate = useCallback((updated: Order) => {
    if (updated.status === "cancelled") {
      setOrders((prev) => prev.filter((o) => o._id !== updated._id));
      setUnpaidOrders((prev) => prev.filter((o) => o._id !== updated._id));
      return;
    }

    if (updated.status === "completed") {
      setOrders((prev) => prev.filter((o) => o._id !== updated._id));
      if (!updated.isPaid) {
        setUnpaidOrders((prev) => upsertOrder(prev, updated));
      } else {
        setUnpaidOrders((prev) => prev.filter((o) => o._id !== updated._id));
      }
      return;
    }

    if (updated.isPaid) {
      setUnpaidOrders((prev) => prev.filter((o) => o._id !== updated._id));
    }

    setOrders((prev) => upsertOrder(prev, updated));
  }, []);

  useEffect(() => {
    function connect() {
      const es = new EventSource("/api/orders/stream");
      esRef.current = es;

      es.onopen = () => setConnected(true);

      es.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.type === "new_order") {
            const order = normalizeOrder(payload.order as Order);
            setOrders((prev) => {
              if (prev.some((o) => o._id === order._id)) return prev;
              return [order, ...prev];
            });
            if (options.notifyNewOrders) {
              toast.info(
                `سفارش جدید${order.tableNumber ? ` (میز ${order.tableNumber})` : ""}`,
                {
                  description: `${order.items.length} آیتم، ${formatToman(order.total)}`,
                }
              );
            }
            options.onOrderChange?.();
          } else if (payload.type === "order_updated") {
            applyOrderUpdate(normalizeOrder(payload.order as Order));
            options.onOrderChange?.();
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
  }, [applyOrderUpdate, options.notifyNewOrders, options.onOrderChange]);

  const updateStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      setUpdatingIds((prev) => new Set(prev).add(orderId));

      const previous =
        orders.find((o) => o._id === orderId) ??
        unpaidOrders.find((o) => o._id === orderId);

      if (previous) {
        if (status === "completed") {
          setOrders((prev) => prev.filter((o) => o._id !== orderId));
          if (!previous.isPaid) {
            setUnpaidOrders((prev) =>
              upsertOrder(prev, { ...previous, status: "completed" })
            );
          }
        } else if (status === "cancelled") {
          setOrders((prev) => prev.filter((o) => o._id !== orderId));
          setUnpaidOrders((prev) => prev.filter((o) => o._id !== orderId));
        } else {
          setOrders((prev) =>
            prev.map((o) => (o._id === orderId ? { ...o, status } : o))
          );
        }
      }

      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (previous) applyOrderUpdate(previous);
          toast.error(data.error || "خطا در به‌روزرسانی وضعیت");
          return;
        }
        applyOrderUpdate(normalizeOrder(data.order as Order));
      } catch {
        if (previous) applyOrderUpdate(previous);
        toast.error("خطا در به‌روزرسانی وضعیت");
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(orderId);
          return next;
        });
      }
    },
    [orders, unpaidOrders, applyOrderUpdate]
  );

  const markPaid = useCallback(
    async (orderId: string) => {
      setUpdatingIds((prev) => new Set(prev).add(orderId));
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPaid: true }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "خطا در ثبت پرداخت");
          return;
        }
        applyOrderUpdate(normalizeOrder(data.order as Order));
        toast.success("پرداخت ثبت شد");
      } catch {
        toast.error("خطا در ثبت پرداخت");
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(orderId);
          return next;
        });
      }
    },
    [applyOrderUpdate]
  );

  return {
    orders,
    unpaidOrders,
    connected,
    updatingIds,
    updateStatus,
    markPaid,
  };
}
