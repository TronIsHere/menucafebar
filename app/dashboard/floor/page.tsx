import { getSession, getCafeForOwner } from "@/lib/session";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models/Order";
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

  const initialOrders = JSON.parse(JSON.stringify(activeOrders));
  const initialUnpaidOrders = JSON.parse(JSON.stringify(unpaidOrders));

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">نقشه سالن</h1>
        <p className="text-muted-foreground text-sm mt-1">
          وضعیت لحظه‌ای میزها — خالی، در حال سفارش، آماده تحویل، در انتظار پرداخت
        </p>
      </div>
      <FloorPlanView
        initialOrders={initialOrders}
        initialUnpaidOrders={initialUnpaidOrders}
        tableNumbers={cafe!.tableNumbers ?? []}
      />
    </div>
  );
}
