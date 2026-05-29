"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DashboardAlertBanner,
  DashboardEmptyState,
  DashboardStatCard,
  IconChip,
} from "@/components/dashboard/primitives";
import { DashboardPage, DashboardPageHeader } from "@/components/dashboard/shell";
import {
  CHART_ACCENT,
  chartGridStroke,
  chartTickMuted,
  chartTooltipStyle,
} from "@/components/dashboard/chart-theme";
import { formatNum, formatToman, formatTomanShort } from "@/components/dashboard/format";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle,
  Clock,
  QrCode,
  ShoppingBag,
  TrendingUp,
  UtensilsCrossed,
} from "@/lib/icons/app-icons";
import { cn } from "@/lib/utils";
import { statusLabels, type OrderStatus } from "@/lib/orders/lifecycle";

export type DashboardStatIcon = "clock" | "shopping-bag" | "trending-up" | "check-circle";

export type DashboardStat = {
  id: string;
  title: string;
  value: string;
  href: string;
  icon: DashboardStatIcon;
  color: string;
  border: string;
  trend?: number | null;
  trendLabel?: string;
  highlight?: boolean;
};

const statIconMap = {
  clock: Clock,
  "shopping-bag": ShoppingBag,
  "trending-up": TrendingUp,
  "check-circle": CheckCircle,
} as const;

export type DashboardOrder = {
  _id: string;
  items: { name: string; quantity: number }[];
  total: number;
  status: OrderStatus;
  source: "customer" | "waiter";
  isPaid: boolean;
  tableNumber?: string;
  createdAt: string;
};

export type WeekPoint = {
  label: string;
  revenue: number;
  count: number;
};

type Props = {
  cafeName: string;
  greeting: string;
  todayLabel: string;
  stats: DashboardStat[];
  recentOrders: DashboardOrder[];
  weekRevenue: WeekPoint[];
  alerts: {
    pendingCount: number;
    readyCount: number;
    unpaidCount: number;
  };
  avgOrderToday: number;
};

const quickActions = [
  {
    href: "/dashboard/orders",
    label: "سفارشات",
    desc: "مدیریت لحظه‌ای",
    icon: ShoppingBag,
    color: "text-orange-500",
    border: "border-orange-200 dark:border-orange-900",
  },
  {
    href: "/dashboard/menu",
    label: "منو",
    desc: "ویرایش آیتم‌ها",
    icon: UtensilsCrossed,
    color: "text-blue-500",
    border: "border-blue-200 dark:border-blue-900",
  },
  {
    href: "/dashboard/qr",
    label: "QR میز",
    desc: "چاپ و اشتراک",
    icon: QrCode,
    color: "text-violet-500",
    border: "border-violet-200 dark:border-violet-900",
  },
  {
    href: "/dashboard/analytics",
    label: "گزارش‌ها",
    desc: "تحلیل فروش",
    icon: BarChart3,
    color: "text-emerald-500",
    border: "border-emerald-200 dark:border-emerald-900",
  },
];

const statusVariant: Record<
  OrderStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "default",
  preparing: "secondary",
  ready: "outline",
  completed: "outline",
  cancelled: "destructive",
};

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${formatNum(diff)} ثانیه پیش`;
  if (diff < 3600) return `${formatNum(Math.floor(diff / 60))} دقیقه پیش`;
  return `${formatNum(Math.floor(diff / 3600))} ساعت پیش`;
}

export default function DashboardHome({
  cafeName,
  greeting,
  todayLabel,
  stats,
  recentOrders,
  weekRevenue,
  alerts,
  avgOrderToday,
}: Props) {
  const hasAlerts =
    alerts.pendingCount > 0 || alerts.readyCount > 0 || alerts.unpaidCount > 0;

  return (
    <DashboardPage>
      <DashboardPageHeader
        eyebrow={todayLabel}
        title={`${greeting}، ${cafeName}`}
        description="خلاصه وضعیت امروز کافه"
        actions={
          <>
            <Button size="sm" className="cursor-pointer gap-1.5" asChild>
              <Link href="/dashboard/orders">
                سفارشات فعال
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="cursor-pointer" asChild>
              <Link href="/dashboard/analytics">مشاهده گزارش</Link>
            </Button>
          </>
        }
      />

      {hasAlerts && (
        <DashboardAlertBanner
          title="نیاز به توجه"
          message={[
            alerts.pendingCount > 0 &&
              `${formatNum(alerts.pendingCount)} سفارش در حال انجام`,
            alerts.readyCount > 0 &&
              `${formatNum(alerts.readyCount)} سفارش آماده تحویل`,
            alerts.unpaidCount > 0 &&
              `${formatNum(alerts.unpaidCount)} سفارش پرداخت‌نشده`,
          ]
            .filter(Boolean)
            .join(" · ")}
          action={
            <Button
              size="sm"
              className="cursor-pointer w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
              asChild
            >
              <Link href="/dashboard/orders">رفتن به سفارشات</Link>
            </Button>
          }
        />
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <DashboardStatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={statIconMap[stat.icon]}
            color={stat.color}
            border={stat.border}
            href={stat.href}
            trend={stat.trend}
            trendLabel={stat.trendLabel}
            highlight={stat.highlight}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group cursor-pointer rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-primary/25"
          >
            <IconChip
              icon={action.icon}
              color={action.color}
              border={action.border}
              className="p-2 mb-3"
            />
            <p className="text-sm font-semibold">{action.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4 sm:gap-6">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <div>
              <CardTitle className="text-base sm:text-lg">درآمد ۷ روز اخیر</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                میانگین سفارش امروز:{" "}
                {avgOrderToday > 0 ? formatToman(avgOrderToday) : "—"}
              </p>
            </div>
            <Link
              href="/dashboard/analytics"
              className="text-xs text-primary hover:underline shrink-0 cursor-pointer"
            >
              جزئیات
            </Link>
          </CardHeader>
          <CardContent className="pb-4">
            {weekRevenue.every((d) => d.revenue === 0) ? (
              <DashboardEmptyState
                icon={BarChart3}
                title="هنوز داده‌ای برای نمودار وجود ندارد"
                action={
                  <Button size="sm" variant="outline" className="cursor-pointer" asChild>
                    <Link href="/dashboard/qr">راه‌اندازی منوی QR</Link>
                  </Button>
                }
              />
            ) : (
              <div className="h-52 sm:h-60 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weekRevenue} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dashRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_ACCENT} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={CHART_ACCENT} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="label"
                      tick={{ fill: chartTickMuted, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: chartTickMuted, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={formatTomanShort}
                      width={48}
                    />
                    <Tooltip
                      contentStyle={chartTooltipStyle}
                      formatter={(value: unknown) => [
                        formatToman(Number(value) || 0),
                        "درآمد",
                      ]}
                      labelFormatter={(label) => `روز ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={CHART_ACCENT}
                      strokeWidth={2}
                      fill="url(#dashRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">خلاصه امروز</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                label: "سفارشات فعال",
                value: formatNum(alerts.pendingCount + alerts.readyCount),
                icon: Clock,
                color: "text-orange-500",
              },
              {
                label: "آماده تحویل",
                value: formatNum(alerts.readyCount),
                icon: CheckCircle,
                color: "text-green-500",
              },
              {
                label: "پرداخت‌نشده",
                value: formatNum(alerts.unpaidCount),
                icon: ShoppingBag,
                color: "text-amber-500",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 px-3 py-2.5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <row.icon className={cn("w-4 h-4 shrink-0", row.color)} />
                  <span className="text-sm text-muted-foreground truncate">{row.label}</span>
                </div>
                <span className="text-sm font-bold tabular-nums">{row.value}</span>
              </div>
            ))}
            <Button className="w-full cursor-pointer mt-2" variant="outline" asChild>
              <Link href="/waiter">حالت پیشخدمت</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-3">
          <div>
            <CardTitle className="text-base sm:text-lg">آخرین سفارشات</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatNum(recentOrders.length)} مورد اخیر
            </p>
          </div>
          <Link
            href="/dashboard/orders"
            className="text-sm text-primary hover:underline cursor-pointer inline-flex items-center gap-1"
          >
            مشاهده همه
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <DashboardEmptyState
              icon={ShoppingBag}
              title="هنوز سفارشی ثبت نشده"
              description="QR منو را روی میزها قرار دهید تا مشتریان سفارش دهند"
              action={
                <Button size="sm" className="cursor-pointer gap-1.5" asChild>
                  <Link href="/dashboard/qr">
                    دریافت QR منو
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order) => {
                const itemPreview = order.items
                  .slice(0, 2)
                  .map((i) => i.name)
                  .join("، ");
                const extra =
                  order.items.length > 2
                    ? ` +${formatNum(order.items.length - 2)}`
                    : "";

                return (
                  <Link
                    key={order._id}
                    href="/dashboard/orders"
                    className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-xl border bg-card hover:bg-muted/30 hover:border-primary/20 transition-colors cursor-pointer min-w-0"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {order.tableNumber || "#"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <p className="text-sm font-medium">
                            {order.tableNumber
                              ? `میز ${order.tableNumber}`
                              : "سفارش آنلاین"}
                          </p>
                          {order.source === "customer" && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              QR
                            </Badge>
                          )}
                          {!order.isPaid && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              پرداخت‌نشده
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {itemPreview}
                          {extra}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {timeAgo(order.createdAt)} · {formatToman(order.total)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={statusVariant[order.status]}
                      className="self-start sm:self-center shrink-0 text-[11px]"
                    >
                      {statusLabels[order.status]}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
