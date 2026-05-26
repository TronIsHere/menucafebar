import { getSession, getCafeForOwner } from "@/lib/session";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models/Order";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default async function AnalyticsPage() {
  const session = await getSession();
  const cafe = await getCafeForOwner(session!.user.id);
  const cafeId = cafe!._id.toString();

  await connectDB();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const [
    dailyRevenue,
    topItems,
    topItemsThisWeek,
    peakHours,
    totalRevenueAgg,
    totalOrders,
    completedOrders,
    thisWeekAgg,
    lastWeekAgg,
  ] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          cafeId,
          status: { $in: ["completed", "ready"] },
          createdAt: { $gte: thirtyDaysAgo },
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

    Order.aggregate([
      { $match: { cafeId, status: { $in: ["completed", "ready"] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalQty: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 10 },
    ]),

    Order.aggregate([
      {
        $match: {
          cafeId,
          status: { $in: ["completed", "ready"] },
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalQty: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
    ]),

    Order.aggregate([
      { $match: { cafeId, status: { $in: ["completed", "ready"] } } },
      {
        $group: {
          _id: {
            $hour: { date: "$createdAt", timezone: "Asia/Tehran" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    Order.aggregate([
      { $match: { cafeId, status: { $in: ["completed", "ready"] } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),

    Order.countDocuments({ cafeId }),

    Order.countDocuments({ cafeId, status: { $in: ["completed", "ready"] } }),

    Order.aggregate([
      {
        $match: {
          cafeId,
          status: { $in: ["completed", "ready"] },
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
    ]),

    Order.aggregate([
      {
        $match: {
          cafeId,
          status: { $in: ["completed", "ready"] },
          createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
        },
      },
      { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
    ]),
  ]);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">آمار و گزارش</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          بررسی عملکرد کافه شما
        </p>
      </div>
      <AnalyticsDashboard
        dailyRevenue={JSON.parse(JSON.stringify(dailyRevenue))}
        topItems={JSON.parse(JSON.stringify(topItems))}
        topItemsThisWeek={JSON.parse(JSON.stringify(topItemsThisWeek))}
        peakHours={JSON.parse(JSON.stringify(peakHours))}
        totalRevenue={totalRevenueAgg[0]?.total ?? 0}
        totalOrders={totalOrders}
        completedOrders={completedOrders}
        thisWeekRevenue={thisWeekAgg[0]?.total ?? 0}
        lastWeekRevenue={lastWeekAgg[0]?.total ?? 0}
        thisWeekOrders={thisWeekAgg[0]?.count ?? 0}
        lastWeekOrders={lastWeekAgg[0]?.count ?? 0}
      />
    </div>
  );
}
