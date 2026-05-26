import { Order } from "@/lib/db/models/Order";
import {
  getJalaliMonthRange,
  getJalaliWeekRange,
  getTodayJalali,
  jalaliDayRange,
} from "@/lib/dates/jalali";
import type { OrderStatus } from "@/lib/orders/lifecycle";

export interface OrderHistoryFilters {
  from?: string;
  to?: string;
  preset?: "today" | "week" | "month" | "all";
  status?: string;
  source?: "customer" | "waiter";
  isPaid?: "true" | "false";
  table?: string;
  page?: number;
  limit?: number;
}

export interface OrderHistoryResult {
  orders: Record<string, unknown>[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    orderCount: number;
    totalRevenue: number;
    completedCount: number;
    cancelledCount: number;
    unpaidCount: number;
  };
}

const ALL_STATUSES: OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

function resolveDateRange(filters: OrderHistoryFilters): {
  start?: Date;
  end?: Date;
} {
  if (filters.preset === "all") return {};

  if (filters.preset === "today") {
    const { jy, jm, jd } = getTodayJalali();
    const dayStr = `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")}`;
    const range = jalaliDayRange(dayStr);
    return range ? { start: range.start, end: range.end } : {};
  }

  if (filters.preset === "week") {
    const { start, end } = getJalaliWeekRange();
    return { start, end };
  }

  if (filters.preset === "month") {
    const { jy, jm } = getTodayJalali();
    const { start, end } = getJalaliMonthRange(jy, jm);
    return { start, end };
  }

  let start: Date | undefined;
  let end: Date | undefined;

  if (filters.from) {
    const fromRange = jalaliDayRange(filters.from);
    if (fromRange) start = fromRange.start;
  }
  if (filters.to) {
    const toRange = jalaliDayRange(filters.to);
    if (toRange) end = toRange.end;
  }

  return { start, end };
}

function buildQuery(cafeId: string, filters: OrderHistoryFilters) {
  const query: Record<string, unknown> = { cafeId };
  const { start, end } = resolveDateRange(filters);

  if (start || end) {
    const createdAt: Record<string, Date> = {};
    if (start) createdAt.$gte = start;
    if (end) createdAt.$lte = end;
    query.createdAt = createdAt;
  }

  if (filters.status && filters.status !== "all") {
    const statuses = filters.status.split(",").filter(Boolean) as OrderStatus[];
    if (statuses.length === 1) {
      query.status = statuses[0];
    } else if (statuses.length > 1) {
      query.status = { $in: statuses };
    }
  }

  if (filters.source) query.source = filters.source;
  if (filters.isPaid === "true") query.isPaid = true;
  if (filters.isPaid === "false") query.isPaid = false;
  if (filters.table?.trim()) query.tableNumber = filters.table.trim();

  return query;
}

export async function fetchOrderHistory(
  cafeId: string,
  filters: OrderHistoryFilters
): Promise<OrderHistoryResult> {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 25));
  const skip = (page - 1) * limit;
  const query = buildQuery(cafeId, filters);

  const [orders, total, statsAgg] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(query),
    Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          orderCount: { $sum: 1 },
          totalRevenue: { $sum: "$total" },
          completedCount: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          cancelledCount: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
          unpaidCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "completed"] },
                    { $eq: ["$isPaid", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),
  ]);

  const stats = statsAgg[0] ?? {
    orderCount: 0,
    totalRevenue: 0,
    completedCount: 0,
    cancelledCount: 0,
    unpaidCount: 0,
  };

  return {
    orders: orders as Record<string, unknown>[],
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    stats: {
      orderCount: stats.orderCount,
      totalRevenue: stats.totalRevenue,
      completedCount: stats.completedCount,
      cancelledCount: stats.cancelledCount,
      unpaidCount: stats.unpaidCount,
    },
  };
}

export { ALL_STATUSES };
