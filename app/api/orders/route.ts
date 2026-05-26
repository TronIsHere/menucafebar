import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models/Order";
import { Cafe } from "@/lib/db/models/Cafe";
import { getSession, getCafeForOwner } from "@/lib/session";
import { publish, publishOrder } from "@/lib/sse";
import { isTableOccupied } from "@/lib/tables/occupancy";
import { toCustomerOrderView } from "@/lib/orders/customer-tracking";
import { fetchOrderHistory } from "@/lib/orders/history-query";
import { calculateDiscount } from "@/lib/customer-club/discount";
import {
  checkNewMember,
  parseVerificationToken,
  registerMember,
} from "@/lib/customer-club/verification";
import { z } from "zod";

const orderSchema = z.object({
  cafeSlug: z.string().optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number().min(1),
        note: z.string().optional(),
      })
    )
    .min(1, "حداقل یک آیتم لازم است"),
  source: z.enum(["customer", "waiter"]),
  tableNumber: z.string().optional(),
  customerName: z.string().optional(),
  note: z.string().optional(),
  verificationToken: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) return NextResponse.json({ error: "Cafe not found" }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const cafeId = cafe._id.toString();

  await connectDB();

  if (searchParams.get("history") === "true") {
    const result = await fetchOrderHistory(cafeId, {
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
      preset: (searchParams.get("preset") as "today" | "week" | "month" | "all") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      source: (searchParams.get("source") as "customer" | "waiter") ?? undefined,
      isPaid: (searchParams.get("isPaid") as "true" | "false") ?? undefined,
      table: searchParams.get("table") ?? undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "25"),
    });
    return NextResponse.json(result);
  }

  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "50");

  const query: Record<string, unknown> = { cafeId };
  if (status) query.status = status;

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = orderSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  await connectDB();

  let cafeId: string;
  let cafeTableNumbers: string[] = [];
  let customerCafe: Awaited<ReturnType<typeof Cafe.findOne>> = null;

  if (result.data.source === "customer" && result.data.cafeSlug) {
    const cafe = await Cafe.findOne({ slug: result.data.cafeSlug });
    if (!cafe) return NextResponse.json({ error: "Cafe not found" }, { status: 404 });
    cafeId = cafe._id.toString();
    cafeTableNumbers = cafe.tableNumbers ?? [];
    customerCafe = cafe;
  } else {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const cafe = await getCafeForOwner(session.user.id);
    if (!cafe) return NextResponse.json({ error: "Cafe not found" }, { status: 404 });
    cafeId = cafe._id.toString();
    cafeTableNumbers = cafe.tableNumbers ?? [];
  }

  const tableNumber = result.data.tableNumber?.trim();

  if (cafeTableNumbers.length > 0) {
    if (!tableNumber) {
      return NextResponse.json({ error: "شماره میز الزامی است" }, { status: 400 });
    }
    if (!cafeTableNumbers.includes(tableNumber)) {
      return NextResponse.json({ error: "میز انتخاب‌شده معتبر نیست" }, { status: 400 });
    }
    if (await isTableOccupied(cafeId, tableNumber)) {
      return NextResponse.json(
        { error: `میز ${tableNumber} در حال حاضر اشغال است` },
        { status: 409 }
      );
    }
  }

  const subtotal = result.data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let customerPhone: string | undefined;
  let discountPercent = 0;
  let discountAmount = 0;
  let total = subtotal;

  if (result.data.source === "customer" && result.data.verificationToken) {
    const tokenPayload = parseVerificationToken(result.data.verificationToken);
    if (!tokenPayload || tokenPayload.cafeId !== cafeId) {
      return NextResponse.json({ error: "تایید شماره موبایل نامعتبر است" }, { status: 400 });
    }

    customerPhone = tokenPayload.phone;

    if (customerCafe?.customerClubDiscountEnabled) {
      const isNewMember = await checkNewMember(cafeId, tokenPayload.phone);

      if (isNewMember && customerCafe.newCustomerDiscountPercent > 0) {
        const pricing = calculateDiscount(subtotal, customerCafe.newCustomerDiscountPercent);
        discountPercent = pricing.discountPercent;
        discountAmount = pricing.discountAmount;
        total = pricing.total;
      }
    }
  }

  const order = await Order.create({
    cafeId,
    items: result.data.items,
    subtotal: discountAmount > 0 ? subtotal : undefined,
    discountPercent: discountAmount > 0 ? discountPercent : undefined,
    discountAmount: discountAmount > 0 ? discountAmount : undefined,
    total,
    source: result.data.source,
    tableNumber: tableNumber || undefined,
    customerName: result.data.customerName,
    customerPhone,
    note: result.data.note,
    status: "pending",
    isPaid: false,
  });

  if (customerPhone) {
    await registerMember(cafeId, customerPhone);
  }

  // Notify dashboard via SSE
  publish(cafeId, { type: "new_order", order });
  publishOrder(order._id.toString(), {
    type: "order_updated",
    order: toCustomerOrderView(order.toObject()),
  });

  return NextResponse.json({ order }, { status: 201 });
}
