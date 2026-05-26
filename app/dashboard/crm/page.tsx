import { getSession, getCafeForOwner } from "@/lib/session";
import { connectDB } from "@/lib/db/mongoose";
import { InventoryItem } from "@/lib/db/models/InventoryItem";
import { Order } from "@/lib/db/models/Order";
import CRMDashboard from "./CRMDashboard";

export default async function CRMPage() {
  const session = await getSession();
  const cafe = await getCafeForOwner(session!.user.id);
  const cafeId = cafe!._id.toString();

  await connectDB();

  // Get inventory items and recent customers
  const [inventoryItems, recentOrders] = await Promise.all([
    InventoryItem.find({ cafeId }).sort({ name: 1 }).lean(),
    Order.find({ cafeId, source: "customer" })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
  ]);

  // Deduplicate customers by name/table
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
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">CRM و انبار</h1>
      <CRMDashboard
        inventoryItems={JSON.parse(JSON.stringify(inventoryItems))}
        customers={Object.values(customers)}
      />
    </div>
  );
}
