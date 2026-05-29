import { getSession, getCafeForOwner } from "@/lib/session";
import { connectDB } from "@/lib/db/mongoose";
import { InventoryItem } from "@/lib/db/models/InventoryItem";
import { Order } from "@/lib/db/models/Order";
import { DashboardPage, DashboardPageHeader } from "@/components/dashboard/shell";
import CRMDashboard from "./CRMDashboard";

export default async function CRMPage() {
  const session = await getSession();
  const cafe = await getCafeForOwner(session!.user.id);
  const cafeId = cafe!._id.toString();

  await connectDB();

  const [inventoryItems, recentOrders] = await Promise.all([
    InventoryItem.find({ cafeId }).sort({ name: 1 }).lean(),
    Order.find({ cafeId, source: "customer" })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
  ]);

  const customers = recentOrders
    .filter((o) => o.customerName)
    .reduce(
      (acc, order) => {
        const key = order.customerName!;
        if (!acc[key]) {
          acc[key] = {
            name: key,
            orderCount: 0,
            totalSpent: 0,
            lastOrder: order.createdAt,
          };
        }
        acc[key].orderCount++;
        acc[key].totalSpent += order.total;
        if (new Date(order.createdAt) > new Date(acc[key].lastOrder)) {
          acc[key].lastOrder = order.createdAt;
        }
        return acc;
      },
      {} as Record<
        string,
        { name: string; orderCount: number; totalSpent: number; lastOrder: Date }
      >
    );

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="CRM و انبار"
        description="مدیریت موجودی انبار و تاریخچه مشتریان"
      />
      <CRMDashboard
        inventoryItems={JSON.parse(JSON.stringify(inventoryItems))}
        customers={Object.values(customers)}
      />
    </DashboardPage>
  );
}
