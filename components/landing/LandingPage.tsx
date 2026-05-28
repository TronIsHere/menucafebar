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
  Coffee,
  CupSoda,
  Croissant,
  Cookie,
  Sparkles,
  IceCream,
  Plus,
  ChevronDown,
  BadgeCheck,
  CreditCard,
  Lock,
  Ban,
  ScanLine,
  TrendingDown,
  AlertTriangle,
  NotebookPen,
  MapPin,
  ImageOff,
  type LucideIcon,
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
import {
  Reveal,
  AnimatedCounter,
  RotatingWords,
} from "@/components/landing/landing-motion";

const navLinks = [
  { label: "امکانات", href: "#features" },
  { label: "قیمت‌گذاری", href: "#pricing" },
  { label: "نظرات", href: "#testimonials" },
  { label: "سوالات", href: "#faq" },
];

const heroWords = ["هوشمند", "مدرن", "بی‌دردسر", "حرفه‌ای"];

const features = [
  {
    icon: QrCode,
    title: "منوی دیجیتال QR",
    desc: "منوی آنلاین اختصاصی با QR کد. مشتریان بدون نیاز به گارسون سفارش می‌دهند.",
    color: "text-orange-500",
    bg: "bg-orange-50",
    glow: "group-hover:shadow-[0_0_0_1px_hsl(25_95%_53%/0.3)]",
  },
  {
    icon: Zap,
    title: "مدیریت سفارشات زنده",
    desc: "ثبت، پیگیری و تحویل سفارشات به صورت لحظه‌ای. هیچ سفارشی جا نمی‌ماند.",
    color: "text-blue-500",
    bg: "bg-blue-50",
    glow: "group-hover:shadow-[0_0_0_1px_hsl(217_91%_60%/0.3)]",
  },
  {
    icon: BarChart3,
    title: "تحلیل هوشمند فروش",
    desc: "گزارش درآمد، پرفروش‌ترین آیتم‌ها و ساعات اوج مشتری؛ همه در یک نگاه.",
    color: "text-purple-500",
    bg: "bg-purple-50",
    glow: "group-hover:shadow-[0_0_0_1px_hsl(271_91%_65%/0.3)]",
  },
  {
    icon: Users,
    title: "CRM مشتریان",
    desc: "ثبت اطلاعات مشتریان، سابقه سفارشات و مدیریت برنامه وفاداری.",
    color: "text-green-500",
    bg: "bg-green-50",
    glow: "group-hover:shadow-[0_0_0_1px_hsl(142_71%_45%/0.3)]",
  },
  {
    icon: Package,
    title: "مدیریت موجودی",
    desc: "کنترل انبار، هشدار اتمام مواد اولیه و ثبت خرید از تامین‌کنندگان.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    glow: "group-hover:shadow-[0_0_0_1px_hsl(38_92%_50%/0.3)]",
  },
  {
    icon: Smartphone,
    title: "حالت گارسون",
    desc: "رابط کاربری ساده برای ثبت سریع سفارش توسط پرسنل، روی هر گوشی.",
    color: "text-rose-500",
    bg: "bg-rose-50",
    glow: "group-hover:shadow-[0_0_0_1px_hsl(347_77%_60%/0.3)]",
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

type Stat = {
  label: string;
  color: string;
  bg: string;
  icon: LucideIcon;
  to?: number;
  suffix?: string;
  static?: string;
};

const stats: Stat[] = [
  { to: 500, suffix: "+", label: "کافه فعال", color: "text-orange-500", bg: "bg-orange-50", icon: Coffee },
  { to: 2, suffix: "M+", label: "سفارش ثبت‌شده", color: "text-blue-500", bg: "bg-blue-50", icon: ShoppingBag },
  { to: 98, suffix: "٪", label: "رضایت کاربران", color: "text-green-500", bg: "bg-green-50", icon: Star },
  { static: "۲۴/۷", label: "پشتیبانی", color: "text-purple-500", bg: "bg-purple-50", icon: Clock },
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

// Coffee-themed floating icons for the hero backdrop.
const floatIcons = [
  { Icon: Coffee, className: "top-[18%] right-[8%]", size: "w-10 h-10", color: "text-amber-500/40", delay: "0s", dur: "15s" },
  { Icon: Croissant, className: "top-[30%] left-[10%]", size: "w-9 h-9", color: "text-orange-400/40", delay: "-3s", dur: "18s" },
  { Icon: CupSoda, className: "top-[62%] right-[14%]", size: "w-8 h-8", color: "text-rose-400/40", delay: "-6s", dur: "17s" },
  { Icon: Cookie, className: "top-[70%] left-[16%]", size: "w-9 h-9", color: "text-amber-600/40", delay: "-9s", dur: "20s" },
  { Icon: IceCream, className: "top-[12%] left-[26%]", size: "w-7 h-7", color: "text-pink-400/30", delay: "-2s", dur: "19s" },
  { Icon: Sparkles, className: "top-[48%] right-[28%]", size: "w-6 h-6", color: "text-amber-400/40", delay: "-5s", dur: "14s" },
];

// "Trusted by" marquee items (cafe-themed social proof).
const trustedCafes = [
  "کافه آوا",
  "کافه گالری",
  "کافه تهران",
  "روستری لمیز",
  "کافه نقطه",
  "کافه باران",
  "کافه ققنوس",
  "کافه ماه",
];

// Pain points addressed by the product (problem framing before features).
const painPoints = [
  {
    icon: AlertTriangle,
    title: "سفارش‌های فراموش‌شده",
    desc: "ثبت دستی سفارش‌ها باعث اشتباه و نارضایتی مشتری می‌شود.",
  },
  {
    icon: NotebookPen,
    title: "منوی کاغذی قدیمی",
    desc: "هر تغییر قیمت یا آیتم، هزینه و زمان چاپ مجدد دارد.",
  },
  {
    icon: TrendingDown,
    title: "نبود دید مالی",
    desc: "نمی‌دانی چه آیتمی سودآور است و کدام ساعت شلوغ‌تر.",
  },
  {
    icon: Clock,
    title: "اتلاف وقت پرسنل",
    desc: "رفت‌وآمد برای گرفتن سفارش، وقت گارسون را تلف می‌کند.",
  },
];

// Customer-facing digital menu showcase (shown inside the phone mockup).
const menuShowcase = [
  { name: "کاپوچینو", desc: "اسپرسو با شیر بخارپز", price: "۸۵,۰۰۰", img: "/images/menu-coffee.jpg", tag: "پرفروش" },
  { name: "کیک شکلاتی", desc: "گاناش بلژیکی + تمشک", price: "۱۲۰,۰۰۰", img: "/images/menu-cake.jpg", tag: "" },
  { name: "آیس لاته کارامل", desc: "سرد، خنک و خوش‌طعم", price: "۹۵,۰۰۰", img: "/images/menu-iced.jpg", tag: "جدید" },
];

const menuCategories = ["همه", "قهوه گرم", "قهوه سرد", "دسر", "صبحانه"];

const customerSteps = [
  "اسکن QR روی میز، بدون نصب اپلیکیشن",
  "مشاهده منو با عکس، توضیحات و قیمت",
  "ثبت سفارش مستقیم از روی میز",
  "پرداخت و پیگیری لحظه‌ای وضعیت سفارش",
];

const trustBadges = [
  { icon: BadgeCheck, title: "۱۴ روز ضمانت", desc: "بازگشت کامل وجه", color: "text-green-600", bg: "bg-green-50" },
  { icon: CreditCard, title: "بدون کارت بانکی", desc: "برای شروع لازم نیست", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Ban, title: "لغو در هر زمان", desc: "بدون تعهد و قرارداد", color: "text-amber-600", bg: "bg-amber-50" },
  { icon: Lock, title: "امنیت اطلاعات", desc: "رمزگذاری کامل داده‌ها", color: "text-purple-600", bg: "bg-purple-50" },
];

const faqs = [
  {
    q: "آیا واقعاً رایگان است؟",
    a: "بله. پلن رایگان همیشه رایگان است و برای شروع به هیچ کارت بانکی‌ای نیاز ندارید. هر زمان خواستید می‌توانید به پلن حرفه‌ای ارتقا دهید.",
  },
  {
    q: "برای راه‌اندازی به سخت‌افزار خاصی نیاز دارم؟",
    a: "خیر. تنها به یک گوشی یا لپ‌تاپ و اینترنت نیاز دارید. کافی است QR کد را پرینت بگیرید و روی میزها قرار دهید؛ همین.",
  },
  {
    q: "مشتری باید اپلیکیشن نصب کند؟",
    a: "به هیچ وجه. مشتری فقط QR را با دوربین گوشی اسکن می‌کند و منو مستقیم در مرورگر باز می‌شود. بدون نصب، بدون ثبت‌نام.",
  },
  {
    q: "اطلاعات کافه و مشتریانم امن است؟",
    a: "بله. تمام داده‌ها با استانداردهای روز رمزگذاری و روی سرورهای امن نگهداری می‌شوند و دسترسی فقط در اختیار شماست.",
  },
  {
    q: "آیا می‌توانم منو را خودم ویرایش کنم؟",
    a: "بله. از پنل مدیریت در هر لحظه می‌توانید آیتم‌ها، قیمت‌ها، عکس‌ها و دسته‌بندی‌ها را تغییر دهید؛ تغییرات بلافاصله اعمال می‌شوند.",
  },
  {
    q: "اگر سوال یا مشکلی داشتم چه کنم؟",
    a: "تیم پشتیبانی فارسی ما به‌صورت ۲۴/۷ از طریق چت، تیکت و تلگرام آماده کمک به شماست.",
  },
];

function PhotoSlot({
  src,
  alt,
  className,
  rounded = "rounded-xl",
}: {
  src: string;
  alt: string;
  className?: string;
  rounded?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-linear-to-br from-amber-100 via-orange-50 to-rose-100",
        rounded,
        className
      )}
    >
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-amber-700/50">
          <ImageOff className="h-5 w-5" />
          <span className="text-[9px] font-medium">نمونه عکس</span>
        </div>
      )}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border bg-card overflow-hidden transition-colors hover:border-primary/30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 p-4 text-right"
      >
        <span className="text-sm font-semibold">{q}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{a}</p>
        </div>
      </div>
    </div>
  );
}

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
      {/* Animated aurora backdrop (warm coffee tones) */}
      <div className="fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden" aria-hidden>
        <div
          className="lp-aurora-blob absolute -top-40 right-[-10%] w-2xl h-168 rounded-full blur-3xl opacity-50"
          style={{ background: "radial-gradient(circle, hsl(28 95% 60% / 0.35), transparent 65%)" }}
        />
        <div
          className="lp-aurora-blob absolute top-[20%] left-[-15%] w-152 h-152 rounded-full blur-3xl opacity-40"
          style={{ background: "radial-gradient(circle, hsl(340 80% 65% / 0.28), transparent 65%)", animationDelay: "-6s" }}
        />
        <div
          className="lp-aurora-blob absolute bottom-[-10%] right-[20%] w-136 h-136 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, hsl(45 95% 60% / 0.3), transparent 65%)", animationDelay: "-11s" }}
        />
        {/* fine grid texture with radial fade */}
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--border)/0.7) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)/0.7) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black 10%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black 10%, transparent 75%)",
          }}
        />
      </div>

      {/* Navbar */}
      <nav
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled && "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size="sm" />

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative text-sm text-muted-foreground hover:text-foreground transition-colors after:absolute after:-bottom-1 after:right-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
              <Link href="/login">ورود</Link>
            </Button>
            <Button size="sm" className="lp-shine-wrap" asChild>
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
        {/* Floating coffee icons */}
        <div className="absolute inset-0 pointer-events-none select-none hidden sm:block" aria-hidden>
          {floatIcons.map(({ Icon, className, size, color, delay, dur }, i) => (
            <div
              key={i}
              className={cn("lp-drift absolute", className)}
              style={{ animationDelay: delay, animationDuration: dur }}
            >
              <Icon className={cn(size, color)} strokeWidth={1.5} />
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="animate-[lp-fade-up_0.7s_cubic-bezier(0.16,1,0.3,1)_both]">
              <SectionBadge>
                <span className="lp-shine-wrap inline-flex items-center rounded-full">
                  <Zap className="w-3 h-3 inline-block me-1.5 -mt-0.5 text-amber-500" />
                  سیستم مدیریت کافه نسل جدید
                </span>
              </SectionBadge>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.15] mb-5 animate-[lp-fade-up_0.7s_cubic-bezier(0.16,1,0.3,1)_0.08s_both]">
              کافه‌ات را
              <span className="block py-1">
                <RotatingWords
                  words={heroWords}
                  className="lp-gradient-text font-extrabold"
                />
              </span>
              مدیریت کن
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed animate-[lp-fade-up_0.7s_cubic-bezier(0.16,1,0.3,1)_0.16s_both]">
              از منوی دیجیتال QR تا تحلیل فروش، مدیریت موجودی و CRM مشتریان؛
              همه چیز در یک پلتفرم یکپارچه.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-3 animate-[lp-fade-up_0.7s_cubic-bezier(0.16,1,0.3,1)_0.24s_both]">
              <Button
                size="lg"
                className="lp-shine-wrap gap-2 shadow-lg shadow-primary/20 transition-transform hover:scale-[1.03]"
                asChild
              >
                <Link href="/login">
                  همین حالا شروع کن (رایگان)
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="transition-transform hover:scale-[1.03]" asChild>
                <a href="#features">مشاهده امکانات</a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground animate-[lp-fade-up_0.7s_cubic-bezier(0.16,1,0.3,1)_0.3s_both]">
              نیازی به کارت بانکی ندارید
            </p>
          </div>

          {/* Dashboard preview — floating with glow + 3D tilt */}
          <Reveal className="relative mx-auto max-w-5xl" delay={120}>
            <div
              className="absolute -inset-6 -z-10 rounded-4xl blur-2xl opacity-60"
              style={{ background: "linear-gradient(120deg, hsl(28 95% 60% / 0.3), hsl(340 80% 65% / 0.25), hsl(45 95% 60% / 0.3))" }}
              aria-hidden
            />
            <Card
              className="overflow-hidden shadow-2xl border-border/80 transition-transform duration-500 hover:transform-[perspective(1400px)_rotateX(2deg)]"
              style={{ transform: "perspective(1400px) rotateX(6deg)" }}
            >
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
                          "flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors",
                          item.active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
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
                      <span className="relative w-1.5 h-1.5 rounded-full bg-green-500 me-1.5 text-green-500 lp-pulse-ring" />
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
                      <div key={stat.label} className="rounded-lg border bg-card p-3 shadow-sm transition-transform hover:-translate-y-0.5">
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
                          className="lp-bar flex-1 rounded-sm bg-primary/15"
                          style={{
                            height: `${h}%`,
                            backgroundColor: i === 11 ? "hsl(var(--primary))" : undefined,
                            opacity: i === 11 ? 1 : 0.3 + (h / 100) * 0.5,
                            animationDelay: `${0.3 + i * 0.06}s`,
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
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/30 transition-colors hover:bg-muted/60"
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
          </Reveal>

          {/* Trusted-by marquee */}
          <Reveal className="mt-14" delay={80}>
            <p className="text-center text-xs text-muted-foreground mb-5">
              مورد اعتماد کافه‌های سراسر ایران
            </p>
            <div className="lp-marquee relative overflow-hidden mask-[linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
              <div className="lp-marquee-track flex w-max gap-10 pe-10">
                {[...trustedCafes, ...trustedCafes].map((name, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-muted-foreground/70 shrink-0"
                  >
                    <Coffee className="w-4 h-4" strokeWidth={1.75} />
                    <span className="text-sm font-semibold whitespace-nowrap">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 sm:px-6 border-y border-border bg-background/70 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} className="text-center" delay={i * 90}>
              <div className={cn("inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 transition-transform hover:scale-110 hover:-rotate-6", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1">
                {stat.static ? (
                  stat.static
                ) : (
                  <AnimatedCounter to={stat.to!} suffix={stat.suffix} />
                )}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pain points */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <SectionBadge>چرا تغییر؟</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              مدیریت سنتی کافه، پر از دردسر است
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              منوی کاغذی، سفارش‌های گم‌شده و نبود اطلاعات، هر روز به کافه‌ات ضرر می‌زنند.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {painPoints.map((p, i) => (
              <Reveal key={p.title} delay={(i % 4) * 90}>
                <div className="lp-lift relative h-full rounded-xl border border-dashed border-rose-200 bg-rose-50/40 p-5">
                  <span className="absolute top-4 left-4 flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                    <X className="h-3 w-3" />
                  </span>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100/70">
                    <p.icon className="h-5 w-5 text-rose-500" />
                  </div>
                  <h3 className="mb-1.5 font-semibold">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 text-center" delay={120}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary">
              <BadgeCheck className="h-4 w-4" />
              با {APP_NAME} همه این‌ها حل می‌شود
              <ArrowLeft className="h-4 w-4" />
            </span>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <SectionBadge>امکانات</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              همه چیزی که نیاز داری، در یک جا
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              از روز اول تا بزرگ‌ترین روز کافه‌ات، {APP_NAME} همراه توست.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 100}>
                <Card className={cn("group lp-lift h-full hover:shadow-xl", f.glow)}>
                  <CardContent className="p-6">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6",
                        f.bg
                      )}
                    >
                      <f.icon className={cn("w-5 h-5", f.color)} />
                    </div>
                    <h3 className="font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Customer view — digital QR menu on a phone */}
      <section className="py-20 px-4 sm:px-6 bg-background/70 backdrop-blur-sm border-y border-border overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <SectionBadge>
              <ScanLine className="w-3 h-3 inline-block me-1.5 -mt-0.5 text-amber-500" />
              تجربه مشتری
            </SectionBadge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-snug">
              مشتری فقط{" "}
              <span className="lp-gradient-text font-extrabold">QR را اسکن</span>{" "}
              می‌کند
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
              منوی دیجیتال زیبا با عکس و قیمت، مستقیم روی گوشی مشتری باز می‌شود.
              بدون نصب اپلیکیشن، بدون معطلی، بدون اشتباه در سفارش.
            </p>

            <ul className="space-y-3.5 mb-8">
              {customerSteps.map((step) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" className="lp-shine-wrap gap-2 transition-transform hover:scale-[1.03]" asChild>
              <Link href="/login">
                منوی دیجیتال خودت را بساز
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
          </Reveal>

          {/* Phone mockup */}
          <Reveal delay={140} className="flex justify-center">
            <div className="relative">
              {/* glow */}
              <div
                className="absolute -inset-8 -z-10 rounded-full blur-3xl opacity-50"
                style={{ background: "radial-gradient(circle, hsl(28 95% 60% / 0.35), transparent 70%)" }}
                aria-hidden
              />

              <div className="lp-float relative w-[280px] sm:w-[300px] rounded-4xl border-10 border-neutral-900 bg-neutral-900 shadow-2xl">
                {/* notch */}
                <div className="absolute top-0 left-1/2 z-20 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-neutral-900" />

                <div className="flex h-[580px] flex-col overflow-hidden rounded-[1.6rem] bg-background">
                  {/* cafe header */}
                  <div className="relative h-28 shrink-0">
                    <PhotoSlot src="/images/cafe-ambiance.jpg" alt="کافه آوا" rounded="rounded-none" className="h-full w-full" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-2.5 inset-x-3 flex items-end justify-between text-white">
                      <div>
                        <p className="text-sm font-bold">کافه آوا</p>
                        <p className="flex items-center gap-1 text-[10px] opacity-85">
                          <MapPin className="h-2.5 w-2.5" /> میز ۵
                        </p>
                      </div>
                      <span className="rounded-lg bg-white/20 px-2 py-1 text-[9px] font-medium backdrop-blur-sm">
                        باز است
                      </span>
                    </div>
                  </div>

                  {/* categories */}
                  <div className="flex gap-1.5 overflow-hidden border-b border-border px-3 py-2.5">
                    {menuCategories.map((c, i) => (
                      <span
                        key={c}
                        className={cn(
                          "whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium",
                          i === 0
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* items */}
                  <div className="flex-1 space-y-2.5 overflow-hidden p-3">
                    {menuShowcase.map((item) => (
                      <div key={item.name} className="flex gap-2.5 rounded-xl border border-border bg-card p-2">
                        <PhotoSlot src={item.img} alt={item.name} rounded="rounded-lg" className="h-16 w-16 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-xs font-bold">{item.name}</p>
                            {item.tag && (
                              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[8px] font-semibold text-amber-700">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <p className="truncate text-[10px] text-muted-foreground">{item.desc}</p>
                          <div className="mt-1.5 flex items-center justify-between">
                            <span className="text-[11px] font-bold">
                              {item.price}{" "}
                              <span className="text-[8px] font-normal text-muted-foreground">تومان</span>
                            </span>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Plus className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* cart bar */}
                  <div className="shrink-0 border-t border-border bg-card p-3">
                    <div className="flex w-full items-center justify-between rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground">
                      <span className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        مشاهده سبد خرید
                      </span>
                      <span>۲۰۵,۰۰۰ تومان</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* floating QR badge */}
              <div
                className="lp-float absolute -bottom-5 -left-5 rounded-2xl border border-border bg-card p-3 shadow-xl"
                style={{ animationDelay: "-3s" }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-neutral-900 text-white">
                  <QrCode className="h-9 w-9" />
                </div>
                <p className="mt-1.5 text-center text-[9px] font-semibold text-muted-foreground">اسکن کن</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 px-4 sm:px-6 bg-background/70 backdrop-blur-sm border-y border-border">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">چرا {APP_NAME}؟</h2>
            <p className="text-muted-foreground">مزایایی که کافه‌ات را یک قدم جلوتر می‌برد</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyItems.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 100}>
                <div className="lp-lift flex gap-4 p-5 rounded-xl border bg-card h-full hover:shadow-md hover:border-primary/30">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
                    <item.icon className={cn("w-4 h-4", item.color)} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <SectionBadge>شروع کار</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">در ۳ قدم ساده راه‌اندازی کن</h2>
            <p className="text-muted-foreground mb-12">نیازی به دانش فنی یا پشتیبان IT نیست.</p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 120}>
                <Card className="lp-lift text-center h-full hover:shadow-lg">
                  <CardContent className="pt-8 pb-6">
                    <div className="relative w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg shadow-primary/20">
                      {step.num}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100}>
            <Button size="lg" className="lp-shine-wrap gap-2 transition-transform hover:scale-[1.03]" asChild>
              <Link href="/login">
                همین الان شروع کن
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 bg-background/70 backdrop-blur-sm border-y border-border">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <SectionBadge>نظر کاربران</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-bold">صاحبان کافه عاشقش شدند</h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <Card className="lp-lift flex flex-col h-full hover:shadow-lg">
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-amber-500 fill-amber-500" />
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <SectionBadge>قیمت‌گذاری</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">شفاف، بدون هزینه پنهان</h2>
            <p className="text-muted-foreground">همه پلن‌ها با ۱۴ روز آزمایش رایگان شروع می‌شوند.</p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4 items-start">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 110} className="h-full">
                <Card
                  className={cn(
                    "lp-lift relative h-full",
                    plan.highlight
                      ? "border-primary shadow-xl md:scale-[1.04] hover:shadow-2xl"
                      : "hover:shadow-lg"
                  )}
                >
                  {plan.highlight && (
                    <>
                      <div
                        className="absolute -inset-px -z-10 rounded-xl opacity-60 blur-md"
                        style={{ background: "linear-gradient(120deg, hsl(28 95% 60% / 0.4), hsl(340 80% 65% / 0.35))" }}
                        aria-hidden
                      />
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="lp-shine-wrap">محبوب‌ترین</Badge>
                      </div>
                    </>
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
                      className={cn("w-full transition-transform hover:scale-[1.02]", plan.highlight && "lp-shine-wrap")}
                      variant={plan.highlight ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/login">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* Risk reversal & trust badges */}
          <Reveal className="mt-10" delay={80}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {trustBadges.map((b) => (
                <div
                  key={b.title}
                  className="flex items-center gap-3 rounded-xl border bg-card p-4"
                >
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", b.bg)}>
                    <b.icon className={cn("h-5 w-5", b.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight">{b.title}</p>
                    <p className="text-xs text-muted-foreground">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-10">
            <SectionBadge>سوالات متداول</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">هر چه باید بدانی</h2>
            <p className="text-muted-foreground">
              پاسخ سوال‌هایی که صاحبان کافه بیشتر می‌پرسند.
            </p>
          </Reveal>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <FaqItem q={f.q} a={f.a} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8 text-center" delay={120}>
            <p className="text-sm text-muted-foreground">
              سوال دیگری داری؟{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                با ما در تماس باش
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <Card className="bg-primary text-primary-foreground border-primary overflow-hidden">
              <CardContent className="p-10 md:p-14 text-center relative">
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none lp-aurora-blob"
                  aria-hidden
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 25% 40%, hsl(28 95% 65%) 0%, transparent 45%), radial-gradient(circle at 80% 70%, hsl(340 80% 70%) 0%, transparent 45%)",
                  }}
                />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-foreground/10 mb-5">
                    <Coffee className="w-7 h-7 lp-float" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">کافه‌ات را متحول کن</h2>
                  <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto leading-relaxed">
                    بیش از ۵۰۰ کافه در ایران به {APP_NAME} اعتماد کردند. نوبت توست.
                  </p>
                  <Button size="lg" variant="secondary" className="lp-shine-wrap gap-2 transition-transform hover:scale-[1.03]" asChild>
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
          </Reveal>
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
