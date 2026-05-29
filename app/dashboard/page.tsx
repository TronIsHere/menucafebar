import { getSession, getCafeForOwner } from "@/lib/session";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models/Order";
import { calcTrend, formatNum, formatToman } from "@/components/dashboard/format";
import DashboardHome, {
  type DashboardOrder,
  type DashboardStat,
  type DashboardStatIcon,
  type WeekPoint,
} from "./DashboardHome";

function getTehranGreeting(): string {
  const hour = parseInt(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Tehran",
    }).format(new Date()),
    10
  );
  if (hour < 12) return "صبح بخیر";
  if (hour < 17) return "عصر بخیر";
  return "شب بخیر";
}

function buildWeekSeries(
  raw: { _id: string; revenue: number; count: number }[]
): WeekPoint[] {
  const map = new Map(raw.map((r) => [r._id, r]));
  const points: WeekPoint[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    points.push({
      label: `${month}/${day}`,
      revenue: map.get(key)?.revenue ?? 0,
      count: map.get(key)?.count ?? 0,
    });
  }

  return points;
}

export default async function DashboardPage() {
  const session = await getSession();
  const cafe = await getCafeForOwner(session!.user.id);
  const cafeId = cafe!._id.toString();

  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const activeStatuses = ["pending", "preparing", "ready"] as const;

  const [
    totalOrders,
    pendingOrders,
    readyOrders,
    unpaidActive,
    todayOrders,
    yesterdayOrders,
    recentOrdersRaw,
    weekRevenueRaw,
  ] = await Promise.all([
    Order.countDocuments({ cafeId }),
    Order.countDocuments({
      cafeId,
      status: { $in: ["pending", "preparing"] },
    }),
    Order.countDocuments({ cafeId, status: "ready" }),
    Order.countDocuments({
      cafeId,
      status: { $in: activeStatuses },
      isPaid: false,
    }),
    Order.find({
      cafeId,
      createdAt: { $gte: today },
      status: { $ne: "cancelled" },
    }).lean(),
    Order.find({
      cafeId,
      createdAt: { $gte: yesterday, $lt: today },
      status: { $ne: "cancelled" },
    }).lean(),
    Order.find({ cafeId })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    Order.aggregate([
      {
        $match: {
          cafeId,
          status: { $in: ["completed", "ready"] },
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderToday =
    todayOrders.length > 0 ? Math.round(todayRevenue / todayOrders.length) : 0;

  const revenueTrend = calcTrend(todayRevenue, yesterdayRevenue);
  const ordersTrend = calcTrend(todayOrders.length, yesterdayOrders.length);

  const stats = [
    {
      id: "pending",
      title: "سفارشات در حال انجام",
      value: formatNum(pendingOrders),
      icon: "clock" satisfies DashboardStatIcon,
      color: "text-orange-500",
      border: "border-orange-200 dark:border-orange-900",
      href: "/dashboard/orders",
      highlight: pendingOrders > 0,
      trend: null,
    },
    {
      id: "today-orders",
      title: "سفارشات امروز",
      value: formatNum(todayOrders.length),
      icon: "shopping-bag" satisfies DashboardStatIcon,
      color: "text-blue-500",
      border: "border-blue-200 dark:border-blue-900",
      href: "/dashboard/orders",
      trend: ordersTrend,
    },
    {
      id: "today-revenue",
      title: "درآمد امروز",
      value: formatToman(todayRevenue),
      icon: "trending-up" satisfies DashboardStatIcon,
      color: "text-green-500",
      border: "border-emerald-200 dark:border-emerald-900",
      href: "/dashboard/analytics",
      trend: revenueTrend,
    },
    {
      id: "total",
      title: "کل سفارشات",
      value: formatNum(totalOrders),
      icon: "check-circle" satisfies DashboardStatIcon,
      color: "text-purple-500",
      border: "border-violet-200 dark:border-violet-900",
      href: "/dashboard/analytics",
      trend: null,
    },
  ] satisfies DashboardStat[];

  const recentOrders: DashboardOrder[] = recentOrdersRaw.map((order) => ({
    _id: order._id.toString(),
    items: order.items.map((i: { name: string; quantity: number }) => ({
      name: i.name,
      quantity: i.quantity,
    })),
    total: order.total,
    status: order.status,
    source: order.source,
    isPaid: order.isPaid,
    tableNumber: order.tableNumber,
    createdAt: order.createdAt.toISOString(),
  }));

  const weekRevenue = buildWeekSeries(weekRevenueRaw);

  const todayLabel = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <DashboardHome
      cafeName={cafe?.name ?? ""}
      greeting={getTehranGreeting()}
      todayLabel={todayLabel}
      stats={stats}
      recentOrders={recentOrders}
      weekRevenue={weekRevenue}
      alerts={{
        pendingCount: pendingOrders,
        readyCount: readyOrders,
        unpaidCount: unpaidActive,
      }}
      avgOrderToday={avgOrderToday}
    />
  );
}
