"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/brand";
import { AppLogo } from "@/components/brand/AppLogo";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  QrCode,
  BarChart3,
  Package,
  Settings,
  LogOut,
  UserCheck,
  Menu,
  LayoutGrid,
  History,
} from "@/lib/icons/app-icons";

const navItems = [
  { href: "/dashboard", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/orders", label: "سفارشات", icon: ShoppingBag, exact: true },
  { href: "/dashboard/orders/history", label: "تاریخچه سفارشات", icon: History },
  { href: "/dashboard/floor", label: "نقشه سالن", icon: LayoutGrid },
  { href: "/dashboard/menu", label: "منو", icon: UtensilsCrossed },
  { href: "/dashboard/qr", label: "QR منو", icon: QrCode },
  { href: "/dashboard/analytics", label: "آمار و گزارش", icon: BarChart3 },
  { href: "/dashboard/crm", label: "CRM و انبار", icon: Package },
  { href: "/dashboard/settings", label: "تنظیمات", icon: Settings },
];

const quickLinks = [
  { href: "/waiter", label: "حالت پیشخدمت", icon: UserCheck },
];

function SidebarContent({
  cafeName,
  onNavigate,
}: {
  cafeName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    toast.success("خروج موفق");
    onNavigate?.();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <AppLogo size="sm" />
        <div className="min-w-0">
          <p className="font-bold text-sm truncate">{cafeName || APP_NAME}</p>
          <p className="text-xs text-muted-foreground">پنل مدیریت</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-2">
        <p className="text-xs text-muted-foreground px-3 mb-1 uppercase tracking-wide">
          دسترسی سریع
        </p>
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <link.icon className="w-4 h-4 shrink-0" />
            {link.label}
          </Link>
        ))}
      </div>

      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4" />
          خروج از حساب
        </Button>
      </div>
    </>
  );
}

export function MobileDashboardHeader({ cafeName }: { cafeName?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="lg:hidden sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-card border-b border-border shrink-0">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="باز کردن منو">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 flex flex-col">
          <SheetTitle className="sr-only">منوی ناوبری</SheetTitle>
          <SidebarContent cafeName={cafeName} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <AppLogo size="xs" />
        <p className="font-bold text-sm truncate">{cafeName || APP_NAME}</p>
      </div>
    </header>
  );
}

export function Sidebar({ cafeName }: { cafeName?: string }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-card border-e border-border shrink-0">
      <SidebarContent cafeName={cafeName} />
    </aside>
  );
}
