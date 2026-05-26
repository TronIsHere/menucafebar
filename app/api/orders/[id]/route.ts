import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models/Order";
import { getSession, getCafeForOwner } from "@/lib/session";
import { publish, publishOrder } from "@/lib/sse";
import { getNextStatus, type OrderStatus } from "@/lib/orders/lifecycle";
import { toCustomerOrderView } from "@/lib/orders/customer-tracking";
import { z } from "zod";

const patchSchema = z.object({
  status: z
    .enum(["pending", "preparing", "ready", "completed", "cancelled"])
    .optional(),
  isPaid: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) return NextResponse.json({ error: "Cafe not found" }, { status: 404 });

  const { id } = await params;
  const body = await request.json();
  const result = patchSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  await connectDB();

  if (result.data.status) {
    const existing = await Order.findOne({ _id: id, cafeId: cafe._id.toString() });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const allowedNext = getNextStatus(existing.status as OrderStatus);
    if (
      result.data.status !== allowedNext &&
      result.data.status !== "cancelled"
    ) {
      return NextResponse.json(
        { error: "انتقال وضعیت نامعتبر است" },
        { status: 400 }
      );
    }
  }

  const order = await Order.findOneAndUpdate(
    { _id: id, cafeId: cafe._id.toString() },
    { $set: result.data },
    { new: true }
  ).lean();

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  publish(cafe._id.toString(), { type: "order_updated", order });
  publishOrder(id, {
    type: "order_updated",
    order: toCustomerOrderView(order as Record<string, unknown>),
  });

  return NextResponse.json({ order });
}
