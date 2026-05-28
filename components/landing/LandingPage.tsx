"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Users,
  Package,
  QrCode,
  Zap,
  ArrowLeft,
  Check,
  Star,
  Smartphone,
  Menu,
  X,
  TrendingUp,
  Shield,
  Clock,
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { AppLogo } from "@/components/brand/AppLogo";

const navLinks = [
  { label: "امکانات", href: "#features" },
  { label: "قیمت‌گذاری", href: "#pricing" },
  { label: "نظرات", href: "#testimonials" },
];

const features = [
  {
    icon: QrCode,
    title: "منوی دیجیتال QR",
    desc: "منوی آنلاین اختصاصی با QR کد. مشتریان بدون نیاز به گارسون سفارش می‌دهند.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: Zap,
    title: "مدیریت سفارشات زنده",
    desc: "ثبت، پیگیری و تحویل سفارشات به صورت لحظه‌ای. هیچ سفارشی جا نمی‌ماند.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: BarChart3,
    title: "تحلیل هوشمند فروش",
    desc: "گزارش درآمد، پرفروش‌ترین آیتم‌ها و ساعات اوج مشتری؛ همه در یک نگاه.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Users,
    title: "CRM مشتریان",
    desc: "ثبت اطلاعات مشتریان، سابقه سفارشات و مدیریت برنامه وفاداری.",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: Package,
    title: "مدیریت موجودی",
    desc: "کنترل انبار، هشدار اتمام مواد اولیه و ثبت خرید از تامین‌کنندگان.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Smartphone,
    title: "حالت گارسون",
    desc: "رابط کاربری ساده برای ثبت سریع سفارش توسط پرسنل، روی هر گوشی.",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
];

const steps = [
  {
    num: "۱",
    title: "ثبت‌نام رایگان",
    desc: "با شماره موبایل خود وارد شوید. نیازی به ایمیل یا رمز عبور نیست.",
  },
  {
    num: "۲",
    title: "تنظیم کافه",
    desc: "اطلاعات کافه، منو و دسته‌بندی‌ها را در چند دقیقه وارد کنید.",
  },
  {
    num: "۳",
    title: "شروع به کار",
    desc: "QR کد را پرینت بگیرید و سیستم را راه‌اندازی کنید. همین!",
  },
];

const testimonials = [
  {
    name: "علی محمدی",
    cafe: "کافه آوا، تهران",
    text: `از زمانی که ${APP_NAME} رو استفاده می‌کنم، مدیریت سفارشات خیلی راحت‌تر شده. درآمدم ۳۰٪ بیشتر شده و اشتباهات سفارش به صفر رسیده.`,
    avatar: "ع",
    avatarBg: "bg-orange-100 text-orange-700",
  },
  {
    name: "سارا کریمی",
    cafe: "کافه گالری، اصفهان",
    text: "بهترین سیستم مدیریت کافه‌ای که تا حالا استفاده کردم. پشتیبانی عالی داره و رابط کاربری خیلی شیک و حرفه‌ایه.",
    avatar: "س",
    avatarBg: "bg-purple-100 text-purple-700",
  },
  {
    name: "رضا تهرانی",
    cafe: "کافه تهران، مشهد",
    text: `گزارش‌های تحلیلی ${APP_NAME} کمک کرد بفهمم کدوم آیتم‌ها سودآورترن. موجودی انبارم هم الان تحت کنترله.`,
    avatar: "ر",
    avatarBg: "bg-green-100 text-green-700",
  },
];

const plans = [
  {
    name: "رایگان",
    price: "۰",
    period: "همیشه رایگان",
    features: [
      "۱ کافه",
      "منوی دیجیتال QR",
      "ثبت سفارش آنلاین",
      "تا ۵۰ سفارش ماهانه",
      "پشتیبانی پایه",
    ],
    cta: "شروع کنید",
    highlight: false,
  },
  {
    name: "حرفه‌ای",
    price: "۱۴۹,۰۰۰",
    period: "تومان / ماه",
    features: [
      "۳ کافه",
      "همه امکانات رایگان",
      "تحلیل فروش پیشرفته",
      "مدیریت موجودی",
      "CRM مشتریان",
      "پشتیبانی اولویت‌دار",
    ],
    cta: "۱۴ روز رایگان امتحان کن",
    highlight: true,
  },
  {
    name: "سازمانی",
    price: "تماس",
    period: "بگیرید",
    features: [
      "کافه نامحدود",
      "همه امکانات حرفه‌ای",
      "API اختصاصی",
      "یکپارچه با نرم‌افزار حسابداری",
      "مدیر حساب اختصاصی",
      "SLA اضمینان ۹۹.۹٪",
    ],
    cta: "تماس با ما",
    highlight: false,
  },
];

const stats = [
  { value: "۵۰۰+", label: "کافه فعال", color: "text-orange-500", bg: "bg-orange-50" },
  { value: "۲M+", label: "سفارش ثبت‌شده", color: "text-blue-500", bg: "bg-blue-50" },
  { value: "۹۸٪", label: "رضایت کاربران", color: "text-green-500", bg: "bg-green-50" },
  { value: "۲۴/۷", label: "پشتیبانی", color: "text-purple-500", bg: "bg-purple-50" },
];

const whyItems = [
  {
    icon: Zap,
    title: "راه‌اندازی سریع",
    desc: "در کمتر از ۱۰ دقیقه کافه‌ات را راه‌اندازی کن. بدون نیاز به دانش فنی.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: Shield,
    title: "امنیت بالا",
    desc: "اطلاعات کافه و مشتریانت با بالاترین استانداردهای امنیتی محافظت می‌شود.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: TrendingUp,
    title: "رشد درآمد",
    desc: `کافه‌هایی که از ${APP_NAME} استفاده می‌کنند به طور میانگین ۲۵٪ افزایش درآمد دارند.`,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: Clock,
    title: "صرفه‌جویی در زمان",
    desc: "تا ۳ ساعت در روز در مدیریت دستی سفارشات و موجودی صرفه‌جویی کن.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Smartphone,
    title: "سازگار با موبایل",
    desc: "روی هر دستگاهی کار می‌کند. گوشی، تبلت و لپ‌تاپ، بدون نصب اپلیکیشن.",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    icon: Users,
    title: "پشتیبانی فارسی",
    desc: "تیم پشتیبانی ما ۲۴/۷ آماده پاسخگویی به سوالات شما به زبان فارسی است.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const mockOrders = [
  { table: "میز ۵", items: "اسپرسو دوبل، کیک شکلاتی", status: "در حال آماده‌سازی", variant: "secondary" as const, num: "۵" },
  { table: "میز ۲", items: "کاپوچینو، ماکارون", status: "تکمیل شده", variant: "outline" as const, num: "۲" },
  { table: "میز ۸", items: "چای ماسالا، چیزکیک", status: "جدید", variant: "default" as const, num: "۸" },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: "داشبورد", active: true },
  { icon: ShoppingBag, label: "سفارشات", active: false },
  { icon: UtensilsCrossed, label: "منو", active: false },
  { icon: BarChart3, label: "آمار", active: false },
  { icon: Package, label: "CRM", active: false },
  { icon: Settings, label: "تنظیمات", active: false },
];

const chartBars = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88];

function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const textSize = size === "sm" ? "text-base" : "text-lg";

  return (
    <div className="flex items-center gap-3">
      <AppLogo size={size === "sm" ? "xs" : "sm"} />
      <div>
        <p className={cn("font-bold leading-none", textSize)}>{APP_NAME}</p>
        {size === "md" && (
          <p className="text-xs text-muted-foreground mt-0.5">{APP_TAGLINE}</p>
        )}
      </div>
    </div>
  );
}

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium">
      {children}
    </Badge>
  );
}

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-muted/20 text-foreground overflow-x-hidden">
      {/* Subtle background */}
      <div
        className="fixed inset-0 pointer-events-none select-none"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 50% at 50% -20%, hsl(220 14.3% 95.9% / 0.8) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 90% 20%, hsl(220 14.3% 95.9% / 0.5) 0%, transparent 50%)
          `,
        }}
      />

      {/* Navbar */}
      <nav
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled && "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size="sm" />

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
              <Link href="/login">ورود</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/login">شروع رایگان</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-background border-t border-border px-4 py-4 flex flex-col gap-1">
            {[...navLinks, { label: "ورود", href: "/login" }].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <SectionBadge>
              <Zap className="w-3 h-3 inline-block me-1.5 -mt-0.5" />
              سیستم مدیریت کافه نسل جدید
            </SectionBadge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-5">
              کافه‌ات را{" "}
              <span className="text-primary">هوشمند</span> مدیریت کن
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              از منوی دیجیتال QR تا تحلیل فروش، مدیریت موجودی و CRM مشتریان؛
              همه چیز در یک پلتفرم یکپارچه.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-3">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/login">
                  همین حالا شروع کن (رایگان)
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#features">مشاهده امکانات</a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">نیازی به کارت بانکی ندارید</p>
          </div>

          {/* Dashboard preview — mirrors actual dashboard UI */}
          <div className="relative mx-auto max-w-5xl">
            <Card className="overflow-hidden shadow-xl border-border/80">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/40">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="mx-auto bg-background rounded-md px-8 py-0.5 text-xs text-muted-foreground border border-border">
                  menucafe.ir/dashboard
                </div>
              </div>

              <div className="flex min-h-[360px] bg-muted/20">
                {/* Mini sidebar */}
                <div className="hidden sm:flex flex-col w-48 bg-card border-e border-border shrink-0">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <AppLogo size="xs" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">کافه آوا</p>
                        <p className="text-[10px] text-muted-foreground">پنل مدیریت</p>
                      </div>
                    </div>
                  </div>
                  <nav className="p-2 space-y-0.5 flex-1">
                    {sidebarItems.map((item) => (
                      <div
                        key={item.label}
                        className={cn(
                          "flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium",
                          item.active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        <item.icon className="w-3.5 h-3.5 shrink-0" />
                        {item.label}
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Main area */}
                <div className="flex-1 p-4 sm:p-5 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold">خوش آمدید 👋</h3>
                      <p className="text-xs text-muted-foreground">خلاصه وضعیت کافه</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 me-1.5 animate-pulse" />
                      آنلاین
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-3">
                    {[
                      { label: "در حال انجام", value: "۸", color: "text-orange-500", bg: "bg-orange-50", icon: Clock },
                      { label: "سفارشات امروز", value: "۴۷", color: "text-blue-500", bg: "bg-blue-50", icon: ShoppingBag },
                      { label: "درآمد امروز", value: "۲.۸M", color: "text-green-500", bg: "bg-green-50", icon: TrendingUp },
                      { label: "کل سفارشات", value: "۱,۲۴۰", color: "text-purple-500", bg: "bg-purple-50", icon: Check },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-lg border bg-card p-3 shadow-sm">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] text-muted-foreground truncate">{stat.label}</p>
                            <p className="text-base font-bold mt-0.5">{stat.value}</p>
                          </div>
                          <div className={cn("p-2 rounded-lg shrink-0", stat.bg)}>
                            <stat.icon className={cn("w-3.5 h-3.5", stat.color)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border bg-card p-3 mb-3 shadow-sm">
                    <p className="text-xs font-medium mb-2">درآمد هفتگی</p>
                    <div className="h-16 flex items-end gap-1">
                      {chartBars.map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm bg-primary/15"
                          style={{
                            height: `${h}%`,
                            backgroundColor: i === 11 ? "hsl(var(--primary))" : undefined,
                            opacity: i === 11 ? 1 : 0.3 + (h / 100) * 0.5,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border bg-card shadow-sm">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-xs font-medium">آخرین سفارشات</p>
                    </div>
                    <div className="p-2 space-y-1.5">
                      {mockOrders.map((order) => (
                        <div
                          key={order.table}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                              {order.num}
                            </div>
                            <div>
                              <p className="text-xs font-medium">{order.table}</p>
                              <p className="text-[10px] text-muted-foreground">{order.items}</p>
                            </div>
                          </div>
                          <Badge variant={order.variant} className="text-[10px] px-1.5 py-0">
                            {order.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 sm:px-6 border-y border-border bg-background">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={cn("inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3", stat.bg)}>
                <span className={cn("text-xl font-bold", stat.color)}>{stat.value.charAt(0)}</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionBadge>امکانات</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              همه چیزی که نیاز داری، در یک جا
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              از روز اول تا بزرگ‌ترین روز کافه‌ات، {APP_NAME} همراه توست.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <Card key={f.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mb-4", f.bg)}>
                    <f.icon className={cn("w-5 h-5", f.color)} />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 px-4 sm:px-6 bg-background border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">چرا {APP_NAME}؟</h2>
            <p className="text-muted-foreground">مزایایی که کافه‌ات را یک قدم جلوتر می‌برد</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyItems.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-5 rounded-xl border bg-card hover:shadow-sm transition-shadow"
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
                  <item.icon className={cn("w-4 h-4", item.color)} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionBadge>شروع کار</SectionBadge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">در ۳ قدم ساده راه‌اندازی کن</h2>
          <p className="text-muted-foreground mb-12">نیازی به دانش فنی یا پشتیبان IT نیست.</p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {steps.map((step) => (
              <Card key={step.num} className="text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.num}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button size="lg" asChild>
            <Link href="/login">
              همین الان شروع کن
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 bg-background border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionBadge>نظر کاربران</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-bold">صاحبان کافه عاشقش شدند</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <Card key={t.name} className="flex flex-col">
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold", t.avatarBg)}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.cafe}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionBadge>قیمت‌گذاری</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">شفاف، بدون هزینه پنهان</h2>
            <p className="text-muted-foreground">همه پلن‌ها با ۱۴ روز آزمایش رایگان شروع می‌شوند.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 items-start">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "relative",
                  plan.highlight && "border-primary shadow-lg md:scale-[1.03]"
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>محبوب‌ترین</Badge>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex items-end gap-1.5 pt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground mb-1">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlight ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/login">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-primary text-primary-foreground border-primary overflow-hidden">
            <CardContent className="p-10 md:p-14 text-center relative">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                aria-hidden
                style={{
                  backgroundImage: "radial-gradient(circle at 30% 50%, white 0%, transparent 50%)",
                }}
              />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">کافه‌ات را متحول کن</h2>
                <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto leading-relaxed">
                  بیش از ۵۰۰ کافه در ایران به {APP_NAME} اعتماد کردند. نوبت توست.
                </p>
                <Button size="lg" variant="secondary" className="gap-2" asChild>
                  <Link href="/login">
                    شروع کن (کاملاً رایگان)
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </Button>
                <p className="text-xs text-primary-foreground/50 mt-4">
                  نیازی به کارت بانکی ندارید · بدون تعهد · هر لحظه لغو کنید
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <Logo size="sm" />
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                سیستم یکپارچه مدیریت کافه، رستوران و فست‌فود ایرانی.
              </p>
            </div>

            {[
              { title: "محصول", links: ["امکانات", "قیمت‌گذاری", "مستندات", "وضعیت سیستم"] },
              { title: "شرکت", links: ["درباره ما", "بلاگ", "فرصت‌های شغلی", "تماس با ما"] },
              { title: "پشتیبانی", links: ["مرکز راهنما", "سوالات متداول", "تیکت پشتیبانی", "کانال تلگرام"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-muted-foreground">© ۱۴۰۴ {APP_NAME}. تمام حقوق محفوظ است.</p>
            <div className="flex gap-5">
              {["حریم خصوصی", "شرایط استفاده", "سیاست کوکی"].map((item) => (
                <a key={item} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
