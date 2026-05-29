import { getSession, getCafeForOwner } from "@/lib/session";
import { connectDB } from "@/lib/db/mongoose";
import { fetchOrderHistory } from "@/lib/orders/history-query";
import { normalizeOrder } from "@/lib/orders/lifecycle";
import { DashboardPage, DashboardPageHeader } from "@/components/dashboard/shell";
import { OrderNav } from "../OrderNav";
import OrderHistoryTable from "./OrderHistoryTable";

interface Props {
  searchParams: Promise<{
    page?: string;
    from?: string;
    to?: string;
    preset?: string;
    status?: string;
    source?: string;
    isPaid?: string;
    table?: string;
  }>;
}

export default async function OrderHistoryPage({ searchParams }: Props) {
  const params = await searchParams;
  const session = await getSession();
  const cafe = await getCafeForOwner(session!.user.id);
  const cafeId = cafe!._id.toString();

  await connectDB();

  const result = await fetchOrderHistory(cafeId, {
    page: parseInt(params.page || "1"),
    limit: 25,
    from: params.from,
    to: params.to,
    preset: (params.preset as "today" | "week" | "month" | "all") ?? "month",
    status: params.status ?? "all",
    source:
      params.source && params.source !== "all"
        ? (params.source as "customer" | "waiter")
        : undefined,
    isPaid:
      params.isPaid && params.isPaid !== "all"
        ? (params.isPaid as "true" | "false")
        : undefined,
    table: params.table,
  });

  const orders = result.orders.map((o) =>
    normalizeOrder(JSON.parse(JSON.stringify(o)))
  );

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="تاریخچه سفارشات"
        description="مشاهده و جستجوی تمام سفارشات با تاریخ شمسی"
      />
      <OrderNav />
      <OrderHistoryTable
        orders={orders}
        stats={result.stats}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
        limit={result.limit}
        filters={{
          preset: params.preset ?? "month",
          from: params.from ?? "",
          to: params.to ?? "",
          status: params.status ?? "all",
          source: params.source ?? "all",
          isPaid: params.isPaid ?? "all",
          table: params.table ?? "",
        }}
      />
    </DashboardPage>
  );
}
