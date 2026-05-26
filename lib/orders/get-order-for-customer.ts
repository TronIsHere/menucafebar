import { connectDB } from "@/lib/db/mongoose";
import { Cafe } from "@/lib/db/models/Cafe";
import { Order } from "@/lib/db/models/Order";
import { toCustomerOrderView, type CustomerOrderView } from "./customer-tracking";

export async function getOrderForCustomer(
  orderId: string,
  cafeSlug: string
): Promise<{ order: CustomerOrderView; cafeName: string } | null> {
  await connectDB();

  const cafe = await Cafe.findOne({ slug: cafeSlug, isOnboardingComplete: true }).lean();
  if (!cafe) return null;

  const order = await Order.findOne({
    _id: orderId,
    cafeId: cafe._id.toString(),
  }).lean();

  if (!order) return null;

  return {
    order: toCustomerOrderView(order as Record<string, unknown>),
    cafeName: cafe.name,
  };
}
