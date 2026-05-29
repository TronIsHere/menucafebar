"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { History, Radio } from "@/lib/icons/app-icons";

const tabs = [
  { href: "/dashboard/orders", label: "سفارشات زنده", icon: Radio },
  { href: "/dashboard/orders/history", label: "تاریخچه", icon: History },
];

export function OrderNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 p-1 bg-muted rounded-xl w-full sm:w-fit">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-1 sm:flex-initial items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4 shrink-0" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
