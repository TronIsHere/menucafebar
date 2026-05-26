"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { History, Radio } from "lucide-react";

const tabs = [
  { href: "/dashboard/orders", label: "سفارشات زنده", icon: Radio },
  { href: "/dashboard/orders/history", label: "تاریخچه", icon: History },
];

export function OrderNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit mb-4 sm:mb-6">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
