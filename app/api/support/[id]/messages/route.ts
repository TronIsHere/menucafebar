import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/mongoose";
import { SupportTicket } from "@/lib/db/models/SupportTicket";
import { getCafeForOwner, getEnrichedSession } from "@/lib/session";

type RouteParams = { params: Promise<{ id: string }> };

const messageSchema = z.object({
  body: z.string().min(1, "پیام نمی‌تواند خالی باشد").max(5000),
});

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await getEnrichedSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) {
    return NextResponse.json({ error: "کافه یافت نشد" }, { status: 404 });
  }

  const body = await request.json();
  const result = messageSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const { id } = await params;
  await connectDB();

  const ticket = await SupportTicket.findOne({
    _id: id,
    cafeId: cafe._id.toString(),
  });

  if (!ticket) {
    return NextResponse.json({ error: "تیکت یافت نشد" }, { status: 404 });
  }

  if (ticket.status === "closed") {
    return NextResponse.json(
      { error: "این تیکت بسته شده است" },
      { status: 400 }
    );
  }

  ticket.messages.push({
    authorId: session.user.id,
    authorRole: "owner",
    authorName: cafe.name,
    body: result.data.body,
    createdAt: new Date(),
  });
  ticket.lastMessageAt = new Date();
  if (ticket.status === "waiting" || ticket.status === "resolved") {
    ticket.status = "open";
  }
  await ticket.save();

  return NextResponse.json({ ticket });
}
