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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DashboardStatCard,
  IconChip,
  TrendBadge,
} from "@/components/dashboard/primitives";
import {
  CHART_ACCENT,
  chartGridStroke,
  chartTickMuted,
  chartTooltipStyle,
} from "@/components/dashboard/chart-theme";
import {
  calcTrend,
  formatNum,
  formatTomanFull,
} from "@/components/dashboard/format";
import {
  TrendingUp,
  ShoppingBag,
  CheckCircle,
  Wallet,
  Flame,
  Clock,
} from "@/lib/icons/app-icons";
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

function formatTomanAxis(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} م`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} ه`;
  return n.toString();
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

const HOUR_LABELS: Record<number, string> = Object.fromEntries(
  Array.from({ length: 24 }, (_, h) => [h, formatNum(h)])
);

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

  const revenueTrend = calcTrend(thisWeekRevenue, lastWeekRevenue) ?? 0;
  const ordersTrend = calcTrend(thisWeekOrders, lastWeekOrders) ?? 0;

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
      color: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-300 dark:border-emerald-800",
    },
    {
      title: "کل سفارشات",
      value: formatNum(totalOrders),
      icon: ShoppingBag,
      color: "text-blue-600 dark:text-blue-400",
      border: "border-blue-300 dark:border-blue-800",
    },
    {
      title: "نرخ تکمیل",
      value: `${formatNum(completionRate)}٪`,
      icon: CheckCircle,
      color: "text-violet-600 dark:text-violet-400",
      border: "border-violet-300 dark:border-violet-800",
    },
    {
      title: "میانگین سبد",
      value: formatTomanFull(avgOrderValue),
      icon: Wallet,
      color: "text-orange-600 dark:text-orange-400",
      border: "border-orange-300 dark:border-orange-800",
    },
  ];

  return (
    <div className="space-y-5">
      {/* KPI Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <DashboardStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            border={stat.border}
          />
        ))}
      </div>

      {/* Week-over-week comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-xs text-muted-foreground">درآمد این هفته</p>
              <IconChip
                icon={TrendingUp}
                color="text-emerald-600 dark:text-emerald-400"
                border="border-emerald-300 dark:border-emerald-800"
                className="w-8 h-8"
              />
            </div>
            <p className="text-lg sm:text-xl font-bold truncate">
              {formatTomanFull(thisWeekRevenue)}
            </p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <TrendBadge trend={revenueTrend} />
              <span className="text-xs text-muted-foreground">
                نسبت به هفته قبل
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-xs text-muted-foreground">سفارشات این هفته</p>
              <IconChip
                icon={ShoppingBag}
                color="text-blue-600 dark:text-blue-400"
                border="border-blue-300 dark:border-blue-800"
                className="w-8 h-8"
              />
            </div>
            <p className="text-lg sm:text-xl font-bold">
              {formatNum(thisWeekOrders)}
            </p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <TrendBadge trend={ordersTrend} />
              <span className="text-xs text-muted-foreground">
                نسبت به هفته قبل
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2.5">
            <IconChip
              icon={TrendingUp}
              color="text-indigo-500"
              border="border-indigo-300 dark:border-indigo-800"
              className="w-8 h-8"
            />
            <div>
              <CardTitle className="text-base">درآمد روزانه</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                ۳۰ روز گذشته
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          {chartData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={chartData} margin={{ right: 4, left: 4, top: 4 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_ACCENT} stopOpacity={0.28} />
                    <stop offset="95%" stopColor={CHART_ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={chartGridStroke}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: chartTickMuted }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickFormatter={formatTomanAxis}
                  tick={{ fontSize: 10, fill: chartTickMuted }}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                />
                <Tooltip
                  cursor={{ stroke: chartGridStroke }}
                  formatter={(value: unknown) => [
                    formatTomanFull(value as number),
                    "درآمد",
                  ]}
                  labelFormatter={(label) => `تاریخ: ${label}`}
                  contentStyle={chartTooltipStyle}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={CHART_ACCENT}
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Best Sellers — this week / all-time */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2.5">
            <IconChip
              icon={Flame}
              color="text-amber-500"
              border="border-amber-300 dark:border-amber-800"
              className="w-8 h-8"
            />
            <CardTitle className="text-base">پرفروش‌ترین آیتم‌ها</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="week">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="week">این هفته</TabsTrigger>
              <TabsTrigger value="all">کل</TabsTrigger>
            </TabsList>
            <TabsContent value="week" className="mt-4">
              <RankedList
                items={topItemsThisWeek}
                emptyText="داده‌ای برای این هفته وجود ندارد"
              />
            </TabsContent>
            <TabsContent value="all" className="mt-4">
              <RankedList items={topItems} emptyText="داده‌ای برای نمایش وجود ندارد" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Peak Hours */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <IconChip
                icon={Clock}
                color="text-violet-500"
                border="border-violet-300 dark:border-violet-800"
                className="w-8 h-8"
              />
              <CardTitle className="text-base">ساعات اوج مراجعه</CardTitle>
            </div>
            {peakHourEntry.count > 0 && (
              <span className="text-xs text-muted-foreground border border-border px-2 py-1 rounded-full">
                اوج: ساعت {peakHourEntry.label}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          {peakHours.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={peakData} margin={{ right: 4, left: 4, top: 4 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={chartGridStroke}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: chartTickMuted }}
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: chartTickMuted }}
                  tickLine={false}
                  axisLine={false}
                  width={24}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(148, 163, 184, 0.15)" }}
                  formatter={(value: unknown) => [
                    `${formatNum(value as number)} سفارش`,
                    "تعداد",
                  ]}
                  labelFormatter={(label) => `ساعت ${label}`}
                  contentStyle={chartTooltipStyle}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {peakData.map((entry) => {
                    const intensity = entry.count / maxPeak;
                    const alpha = Math.max(0.25, intensity);
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

    </div>
  );
}

function EmptyState({ text = "داده‌ای برای نمایش وجود ندارد" }: { text?: string }) {
  return (
    <p className="text-muted-foreground text-center py-10 text-sm">{text}</p>
  );
}

function RankedList({
  items,
  emptyText,
}: {
  items: TopItem[];
  emptyText: string;
}) {
  if (items.length === 0) return <EmptyState text={emptyText} />;
  return (
    <div className="space-y-2">
      {items.map((item, idx) => {
        const rankLabel =
          idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : null;
        return (
          <div
            key={item._id}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors",
              idx === 0
                ? "border-amber-300 dark:border-amber-800"
                : "border-border hover:border-foreground/20"
            )}
          >
            <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-border text-sm font-bold text-muted-foreground">
              {rankLabel ?? formatNum(idx + 1)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{item._id}</p>
              <p className="text-xs text-muted-foreground">
                {formatTomanFull(item.totalRevenue)}
              </p>
            </div>
            <div className="shrink-0 text-left">
              <p className="text-sm font-bold text-foreground">
                {formatNum(item.totalQty)}
              </p>
              <p className="text-xs text-muted-foreground">عدد</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
