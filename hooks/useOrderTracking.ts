"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CustomerOrderView } from "@/lib/orders/customer-tracking";

export function useOrderTracking(
  orderId: string,
  cafeSlug: string,
  initialOrder: CustomerOrderView
) {
  const [order, setOrder] = useState<CustomerOrderView>(initialOrder);
  const [connected, setConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  const applyUpdate = useCallback((updated: CustomerOrderView) => {
    setOrder(updated);
  }, []);

  useEffect(() => {
    function connect() {
      const url = `/api/orders/${orderId}/stream?cafeSlug=${encodeURIComponent(cafeSlug)}`;
      const es = new EventSource(url);
      esRef.current = es;

      es.onopen = () => setConnected(true);

      es.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.type === "connected" && payload.order) {
            applyUpdate(payload.order as CustomerOrderView);
          } else if (payload.type === "order_updated" && payload.order) {
            applyUpdate(payload.order as CustomerOrderView);
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
  }, [orderId, cafeSlug, applyUpdate]);

  return { order, connected };
}
