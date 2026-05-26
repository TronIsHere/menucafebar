import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models/Order";

export async function getOccupiedTableNumbers(cafeId: string): Promise<string[]> {
  await connectDB();
  const orders = await Order.find({
    cafeId,
    tableNumber: { $exists: true, $nin: [null, ""] },
    isPaid: false,
    status: { $ne: "cancelled" },
  })
    .select("tableNumber")
    .lean();

  return [...new Set(orders.map((o) => o.tableNumber!).filter(Boolean))];
}

export async function isTableOccupied(
  cafeId: string,
  tableNumber: string
): Promise<boolean> {
  await connectDB();
  const existing = await Order.findOne({
    cafeId,
    tableNumber,
    isPaid: false,
    status: { $ne: "cancelled" },
  }).lean();

  return Boolean(existing);
}
