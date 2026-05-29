"use client";

import { useState } from "react";
import { ClipboardList, ShoppingCart } from "@/lib/icons/app-icons";
import { cn } from "@/lib/utils";
import { useOrdersLive } from "@/hooks/useOrdersLive";
import type { Order } from "@/lib/orders/lifecycle";
import WaiterOrderEntry from "./WaiterOrderEntry";
import WaiterOrderBoard from "./WaiterOrderBoard";

interface Category {
  _id: string;
  name: string;
  icon?: string;
}

interface MenuItem {
  _id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
}

interface Props {
  cafeSlug: string;
  categories: Category[];
  items: MenuItem[];
  tableNumbers: string[];
  initialOrders: Order[];
}

type Tab = "order" | "active";

export default function WaiterPageClient({
  cafeSlug,
  categories,
  items,
  tableNumbers,
  initialOrders,
}: Props) {
  const [tab, setTab] = useState<Tab>("order");
  const liveOrders = useOrdersLive(initialOrders, { notifyNewOrders: true });
  const activeCount = liveOrders.orders.length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="sticky top-[57px] z-10 bg-muted/20 backdrop-blur-sm px-4 pt-3 pb-2">
        <div className="flex rounded-lg border bg-card p-1 gap-1">
          <button
            type="button"
            onClick={() => setTab("order")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors",
              tab === "order"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ShoppingCart className="w-4 h-4" />
            ثبت سفارش
          </button>
          <button
            type="button"
            onClick={() => setTab("active")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors relative",
              tab === "active"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ClipboardList className="w-4 h-4" />
            سفارشات فعال
            {activeCount > 0 && tab !== "active" && (
              <span className="absolute top-1 end-2 min-w-5 h-5 px-1 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {tab === "order" ? (
        <WaiterOrderEntry
          cafeSlug={cafeSlug}
          categories={categories}
          items={items}
          tableNumbers={tableNumbers}
        />
      ) : (
        <div className="p-4">
          <WaiterOrderBoard liveOrders={liveOrders} />
        </div>
      )}
    </div>
  );
}
