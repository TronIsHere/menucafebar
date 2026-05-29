import { getSession, getCafeForOwner } from "@/lib/session";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models/Order";
import { DashboardPage, DashboardPageHeader } from "@/components/dashboard/shell";
import FloorPlanView from "@/components/tables/FloorPlanView";

export default async function FloorPage() {
  const session = await getSession();
  const cafe = await getCafeForOwner(session!.user.id);

  await connectDB();
  const [activeOrders, unpaidOrders] = await Promise.all([
    Order.find({
      cafeId: cafe!._id.toString(),
      status: { $in: ["pending", "preparing", "ready"] },
      tableNumber: { $exists: true, $nin: [null, ""] },
    })
      .sort({ createdAt: -1 })
      .lean(),
    Order.find({
      cafeId: cafe!._id.toString(),
      status: "completed",
      isPaid: false,
      tableNumber: { $exists: true, $nin: [null, ""] },
    })
      .sort({ updatedAt: -1 })
      .lean(),
  ]);

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="نقشه سالن"
        description="وضعیت لحظه‌ای میزها — خالی، در حال سفارش، آماده تحویل، در انتظار پرداخت"
      />
      <FloorPlanView
        initialOrders={JSON.parse(JSON.stringify(activeOrders))}
        initialUnpaidOrders={JSON.parse(JSON.stringify(unpaidOrders))}
        tableNumbers={cafe!.tableNumbers ?? []}
      />
    </DashboardPage>
  );
}
