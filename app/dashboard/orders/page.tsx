import { getSession, getCafeForOwner } from "@/lib/session";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models/Order";
import { getOccupiedTableNumbers } from "@/lib/tables/occupancy";
import OrderBoard from "./OrderBoard";
import { OrderNav } from "./OrderNav";

export default async function OrdersPage() {
  const session = await getSession();
  const cafe = await getCafeForOwner(session!.user.id);

  await connectDB();
  const [orders, unpaidOrders] = await Promise.all([
    Order.find({
      cafeId: cafe!._id.toString(),
      status: { $in: ["pending", "preparing", "ready"] },
    })
      .sort({ createdAt: -1 })
      .lean(),
    Order.find({
      cafeId: cafe!._id.toString(),
      status: "completed",
      isPaid: false,
    })
      .sort({ updatedAt: -1 })
      .lean(),
  ]);

  const occupied = await getOccupiedTableNumbers(cafe!._id.toString());

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">سفارشات زنده</h1>
        <p className="text-muted-foreground text-sm mt-1">
          به‌روزرسانی خودکار: سفارشات جدید به‌صورت آنی نمایش داده می‌شوند
        </p>
      </div>
      <OrderNav />
      <OrderBoard
        initialOrders={JSON.parse(JSON.stringify(orders))}
        initialUnpaidOrders={JSON.parse(JSON.stringify(unpaidOrders))}
        tableNumbers={cafe!.tableNumbers ?? []}
        initialOccupied={occupied}
      />
    </div>
  );
}
