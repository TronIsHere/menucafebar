import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/mongoose";
import { SupportTicket } from "@/lib/db/models/SupportTicket";
import { requireAdminSession } from "@/lib/session";

type RouteParams = { params: Promise<{ id: string }> };

const messageSchema = z.object({
  body: z.string().min(1, "پیام نمی‌تواند خالی باشد").max(5000),
  status: z.enum(["in_progress", "waiting", "resolved"]).optional(),
});

export async function POST(request: NextRequest, { params }: RouteParams) {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

  const ticket = await SupportTicket.findById(id);
  if (!ticket) {
    return NextResponse.json({ error: "تیکت یافت نشد" }, { status: 404 });
  }

  ticket.messages.push({
    authorId: session.user.id,
    authorRole: "admin",
    authorName: "پشتیبانی منو کافه",
    body: result.data.body,
    createdAt: new Date(),
  });
  ticket.lastMessageAt = new Date();
  ticket.status = result.data.status ?? "waiting";
  ticket.assignedTo = session.user.id;
  await ticket.save();

  return NextResponse.json({ ticket });
}
