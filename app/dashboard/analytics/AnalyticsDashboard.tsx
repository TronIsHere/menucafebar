"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  CheckCircle,
  Wallet,
  Flame,
  Clock,
  Award,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyRevenue {
  _id: string;
  revenue: number;
  count: number;
}

interface TopItem {
  _id: string;
  totalQty: number;
  totalRevenue: number;
}

interface PeakHour {
  _id: number;
  count: number;
}

interface Props {
  dailyRevenue: DailyRevenue[];
  topItems: TopItem[];
  topItemsThisWeek: TopItem[];
  peakHours: PeakHour[];
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  thisWeekRevenue: number;
  lastWeekRevenue: number;
  thisWeekOrders: number;
  lastWeekOrders: number;
}

function formatToman(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} م`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} ه`;
  return n.toString();
}

function formatTomanFull(n: number) {
  return new Intl.NumberFormat("fa-IR").format(n) + " تومان";
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function calcTrend(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

const HOUR_LABELS: Record<number, string> = {
  0: "۰",
  1: "۱",
  2: "۲",
  3: "۳",
  4: "۴",
  5: "۵",
  6: "۶",
  7: "۷",
  8: "۸",
  9: "۹",
  10: "۱۰",
  11: "۱۱",
  12: "۱۲",
  13: "۱۳",
  14: "۱۴",
  15: "۱۵",
  16: "۱۶",
  17: "۱۷",
  18: "۱۸",
  19: "۱۹",
  20: "۲۰",
  21: "۲۱",
  22: "۲۲",
  23: "۲۳",
};

const RANK_COLORS = [
  { bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800", badge: "bg-amber-400 text-white", dot: "#f59e0b" },
  { bg: "bg-slate-50 dark:bg-slate-800/30", border: "border-slate-200 dark:border-slate-700", badge: "bg-slate-400 text-white", dot: "#94a3b8" },
  { bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800", badge: "bg-orange-400 text-white", dot: "#fb923c" },
];

const PEAK_BAR_COLORS = [
  "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1",
  "#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe",
];

function TrendBadge({ trend }: { trend: number }) {
  if (trend === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
        <Minus className="w-3 h-3" />
        بدون تغییر
      </span>
    );
  }
  const isUp = trend > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        isUp ? "text-emerald-600" : "text-red-500"
      )}
    >
      {isUp ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {Math.abs(trend)}٪
    </span>
  );
}

export default function AnalyticsDashboard({
  dailyRevenue,
  topItems,
  topItemsThisWeek,
  peakHours,
  totalRevenue,
  totalOrders,
  completedOrders,
  thisWeekRevenue,
  lastWeekRevenue,
  thisWeekOrders,
  lastWeekOrders,
}: Props) {
  const chartData = dailyRevenue.map((d) => ({
    date: formatDate(d._id),
    revenue: d.revenue,
    orders: d.count,
  }));

  const barData = topItems.map((item) => ({
    name: item._id.length > 14 ? item._id.slice(0, 14) + "…" : item._id,
    fullName: item._id,
    qty: item.totalQty,
    revenue: item.totalRevenue,
  }));

  const peakData = (() => {
    const all = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      label: HOUR_LABELS[h] ?? String(h),
      count: 0,
    }));
    peakHours.forEach((p) => {
      if (all[p._id]) all[p._id].count = p.count;
    });
    return all.filter((h) => h.count > 0 || (h.hour >= 7 && h.hour <= 23));
  })();

  const completionRate =
    totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
  const avgOrderValue =
    completedOrders > 0 ? Math.round(totalRevenue / completedOrders) : 0;

  const revenueTrend = calcTrend(thisWeekRevenue, lastWeekRevenue);
  const ordersTrend = calcTrend(thisWeekOrders, lastWeekOrders);

  const maxPeak = Math.max(...peakData.map((d) => d.count), 1);
  const peakHourEntry = peakData.reduce(
    (a, b) => (b.count > a.count ? b : a),
    peakData[0] ?? { hour: 0, label: "—", count: 0 }
  );

  const stats = [
    {
      title: "کل درآمد",
      value: formatTomanFull(totalRevenue),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      title: "کل سفارشات",
      value: new Intl.NumberFormat("fa-IR").format(totalOrders),
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      title: "نرخ تکمیل",
      value: `${completionRate}٪`,
      icon: CheckCircle,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/40",
    },
    {
      title: "میانگین سبد",
      value: formatTomanFull(avgOrderValue),
      icon: Wallet,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/40",
    },
  ];

  return (
    <div className="space-y-5">
      {/* KPI Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground leading-tight">
                    {stat.title}
                  </p>
                  <p className="text-base sm:text-lg font-bold mt-1.5 leading-tight truncate">
                    {stat.value}
                  </p>
                </div>
                <div className={cn("p-2 rounded-lg shrink-0", stat.bg)}>
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Week-over-week comparison */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground">درآمد این هفته</p>
            </div>
            <p className="text-base sm:text-lg font-bold truncate">
              {formatTomanFull(thisWeekRevenue)}
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <TrendBadge trend={revenueTrend} />
              <span className="text-xs text-muted-foreground">نسبت به هفته قبل</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-4 h-4 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground">سفارشات این هفته</p>
            </div>
            <p className="text-base sm:text-lg font-bold">
              {new Intl.NumberFormat("fa-IR").format(thisWeekOrders)}
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <TrendBadge trend={ordersTrend} />
              <span className="text-xs text-muted-foreground">نسبت به هفته قبل</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Sellers This Week */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40">
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <CardTitle className="text-base">پرفروش‌ترین این هفته</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {topItemsThisWeek.length === 0 ? (
            <p className="text-muted-foreground text-center py-8 text-sm">
              داده‌ای برای این هفته وجود ندارد
            </p>
          ) : (
            <div className="space-y-2.5">
              {topItemsThisWeek.map((item, idx) => {
                const colors = RANK_COLORS[idx] ?? RANK_COLORS[2];
                const rankLabel =
                  idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}`;
                const isEmoji = idx <= 2;
                return (
                  <div
                    key={item._id}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl border",
                      idx === 0 ? colors.bg + " " + colors.border : "bg-muted/30 border-transparent"
                    )}
                  >
                    <span
                      className={cn(
                        "shrink-0 font-bold text-sm w-7 h-7 flex items-center justify-center rounded-full",
                        isEmoji ? "text-base" : cn("text-xs text-white", colors.badge)
                      )}
                    >
                      {rankLabel}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item._id}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTomanFull(item.totalRevenue)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-foreground">
                        {new Intl.NumberFormat("fa-IR").format(item.totalQty)}
                      </p>
                      <p className="text-xs text-muted-foreground">عدد</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">درآمد روزانه (۳۰ روز گذشته)</CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          {chartData.length === 0 ? (
            <p className="text-muted-foreground text-center py-12 text-sm">
              داده‌ای برای نمایش وجود ندارد
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ right: 4, left: 4, top: 4 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickFormatter={formatToman}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                />
                <Tooltip
                  formatter={(value: unknown) => [
                    formatTomanFull(value as number),
                    "درآمد",
                  ]}
                  labelFormatter={(label) => `تاریخ: ${label}`}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Peak Hours */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/40">
                <Clock className="w-4 h-4 text-violet-500" />
              </div>
              <CardTitle className="text-base">ساعات اوج مراجعه</CardTitle>
            </div>
            {peakHourEntry.count > 0 && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                اوج: ساعت {peakHourEntry.label}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          {peakHours.length === 0 ? (
            <p className="text-muted-foreground text-center py-8 text-sm">
              داده‌ای برای نمایش وجود ندارد
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={peakData} margin={{ right: 4, left: 4, top: 4 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={24}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value: unknown) => [
                    `${new Intl.NumberFormat("fa-IR").format(value as number)} سفارش`,
                    "تعداد",
                  ]}
                  labelFormatter={(label) => `ساعت ${label}`}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {peakData.map((entry) => {
                    const intensity = entry.count / maxPeak;
                    const alpha = Math.max(0.2, intensity);
                    return (
                      <Cell
                        key={entry.hour}
                        fill={`rgba(99,102,241,${alpha})`}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* All-time Top Items */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40">
              <Award className="w-4 h-4 text-blue-500" />
            </div>
            <CardTitle className="text-base">پرفروش‌ترین آیتم‌ها (کل)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          {barData.length === 0 ? (
            <p className="text-muted-foreground text-center py-12 text-sm">
              داده‌ای برای نمایش وجود ندارد
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(200, barData.length * 36)}>
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ right: 16, left: 4, top: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  orientation="top"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                  orientation="right"
                />
                <Tooltip
                  formatter={(value: unknown, key: unknown) =>
                    key === "qty"
                      ? [
                          new Intl.NumberFormat("fa-IR").format(
                            value as number
                          ) + " عدد",
                          "تعداد فروش",
                        ]
                      : [formatTomanFull(value as number), "درآمد"]
                  }
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="qty" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
