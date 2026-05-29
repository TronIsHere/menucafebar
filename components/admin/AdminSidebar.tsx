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
  Headphones,
  LogOut,
  Menu,
  Coffee,
  ArrowLeft,
} from "@/lib/icons/app-icons";

const navItems = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { href: "/admin/support", label: "تیکت‌های پشتیبانی", icon: Headphones },
  { href: "/admin/cafes", label: "کافه‌ها", icon: Coffee },
];

function SidebarContent({
  hasDashboard,
  onNavigate,
}: {
  hasDashboard?: boolean;
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

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <>
      <div className="flex items-center gap-3 p-5 border-b border-border">
        <AppLogo size="sm" />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm truncate">{APP_NAME}</p>
          <p className="text-xs text-muted-foreground">پنل مدیریت سیستم</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
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
      </nav>

      {hasDashboard && (
        <div className="px-3 pb-2">
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            داشبورد کافه
          </Link>
        </div>
      )}

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

export function AdminMobileHeader({ hasDashboard }: { hasDashboard?: boolean }) {
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
            hasDashboard={hasDashboard}
            onNavigate={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <AppLogo size="xs" />
        <p className="font-bold text-sm truncate">پنل مدیریت</p>
      </div>
    </header>
  );
}

export function AdminSidebar({ hasDashboard }: { hasDashboard?: boolean }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-card border-e border-border shrink-0">
      <SidebarContent hasDashboard={hasDashboard} />
    </aside>
  );
}
