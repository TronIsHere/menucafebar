import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/mongoose";
import {
  getNextTicketNumber,
  SupportTicket,
} from "@/lib/db/models/SupportTicket";
import { getUserPhone } from "@/lib/auth/admin";
import { getCafeForOwner, getEnrichedSession } from "@/lib/session";
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
} from "@/lib/support/constants";

const createTicketSchema = z.object({
  subject: z.string().min(3, "موضوع باید حداقل ۳ کاراکتر باشد").max(200),
  category: z.enum(TICKET_CATEGORIES).default("general"),
  priority: z.enum(TICKET_PRIORITIES).default("normal"),
  message: z.string().min(5, "پیام باید حداقل ۵ کاراکتر باشد").max(5000),
});

export async function GET() {
  const session = await getEnrichedSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) {
    return NextResponse.json({ error: "کافه یافت نشد" }, { status: 404 });
  }

  await connectDB();
  const tickets = await SupportTicket.find({ cafeId: cafe._id.toString() })
    .sort({ lastMessageAt: -1 })
    .lean();

  return NextResponse.json({ tickets });
}

export async function POST(request: NextRequest) {
  const session = await getEnrichedSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) {
    return NextResponse.json({ error: "کافه یافت نشد" }, { status: 404 });
  }

  const body = await request.json();
  const result = createTicketSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const ownerPhone = await getUserPhone(session.user.id);
  const ticketNumber = await getNextTicketNumber();

  await connectDB();
  const ticket = await SupportTicket.create({
    ticketNumber,
    cafeId: cafe._id.toString(),
    cafeName: cafe.name,
    ownerId: session.user.id,
    ownerPhone: ownerPhone ?? undefined,
    subject: result.data.subject,
    category: result.data.category,
    priority: result.data.priority,
    status: "open",
    messages: [
      {
        authorId: session.user.id,
        authorRole: "owner",
        authorName: cafe.name,
        body: result.data.message,
        createdAt: new Date(),
      },
    ],
    lastMessageAt: new Date(),
  });

  return NextResponse.json({ ticket }, { status: 201 });
}
