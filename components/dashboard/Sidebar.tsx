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
  Headphones,
  Shield,
  Coffee,
} from "@/lib/icons/app-icons";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "عملیات",
    items: [
      { href: "/dashboard", label: "داشبورد", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/orders", label: "سفارشات زنده", icon: ShoppingBag, exact: true },
      { href: "/dashboard/orders/history", label: "تاریخچه", icon: History },
      { href: "/dashboard/floor", label: "نقشه سالن", icon: LayoutGrid },
    ],
  },
  {
    label: "منو",
    items: [
      { href: "/dashboard/menu", label: "مدیریت منو", icon: UtensilsCrossed },
      { href: "/dashboard/qr", label: "QR منو", icon: QrCode },
    ],
  },
  {
    label: "کسب‌وکار",
    items: [
      { href: "/dashboard/analytics", label: "آمار و گزارش", icon: BarChart3 },
      { href: "/dashboard/crm", label: "CRM و انبار", icon: Package },
    ],
  },
  {
    label: "سیستم",
    items: [
      { href: "/dashboard/support", label: "پشتیبانی", icon: Headphones },
      { href: "/dashboard/settings", label: "تنظیمات", icon: Settings },
    ],
  },
];

const adminNavGroup: { label: string; items: NavItem[] } = {
  label: "مدیریت سیستم",
  items: [
    { href: "/admin", label: "داشبورد ادمین", icon: Shield, exact: true },
    { href: "/admin/support", label: "تیکت‌های پشتیبانی", icon: Headphones },
    { href: "/admin/cafes", label: "کافه‌ها", icon: Coffee },
  ],
};

const quickLinks = [
  { href: "/waiter", label: "حالت پیشخدمت", icon: UserCheck },
];

function SidebarContent({
  cafeName,
  isAdmin,
  onNavigate,
}: {
  cafeName?: string;
  isAdmin?: boolean;
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

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <>
      <div className="flex items-center gap-3 p-5 border-b border-border">
        <AppLogo size="sm" />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm truncate">{cafeName || APP_NAME}</p>
          <p className="text-xs text-muted-foreground">پنل مدیریت</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold text-muted-foreground/70 px-3 mb-1.5 uppercase tracking-wider">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {active && (
                      <span className="absolute inset-y-2 start-0 w-0.5 rounded-full bg-primary" />
                    )}
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {isAdmin && (
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground/70 px-3 mb-1.5 uppercase tracking-wider">
              {adminNavGroup.label}
            </p>
            <div className="space-y-0.5">
              {adminNavGroup.items.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                      active
                        ? "bg-violet-500/10 text-violet-700 dark:text-violet-300"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {active && (
                      <span className="absolute inset-y-2 start-0 w-0.5 rounded-full bg-violet-500" />
                    )}
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <div className="px-3 pb-2">
        <p className="text-[10px] font-semibold text-muted-foreground/70 px-3 mb-1.5 uppercase tracking-wider">
          دسترسی سریع
        </p>
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <link.icon className="w-4 h-4 shrink-0" />
            {link.label}
          </Link>
        ))}
      </div>

      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4" />
          خروج از حساب
        </Button>
      </div>
    </>
  );
}

export function MobileDashboardHeader({
  cafeName,
  isAdmin,
}: {
  cafeName?: string;
  isAdmin?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="lg:hidden sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-card/95 backdrop-blur-md border-b border-border shrink-0">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="باز کردن منو" className="cursor-pointer">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 p-0 flex flex-col data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
        >
          <SheetTitle className="sr-only">منوی ناوبری</SheetTitle>
          <SidebarContent
            cafeName={cafeName}
            isAdmin={isAdmin}
            onNavigate={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <AppLogo size="xs" />
        <p className="font-bold text-sm truncate">{cafeName || APP_NAME}</p>
      </div>
    </header>
  );
}

export function Sidebar({
  cafeName,
  isAdmin,
}: {
  cafeName?: string;
  isAdmin?: boolean;
}) {
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-card border-e border-border shrink-0">
      <SidebarContent cafeName={cafeName} isAdmin={isAdmin} />
    </aside>
  );
}
