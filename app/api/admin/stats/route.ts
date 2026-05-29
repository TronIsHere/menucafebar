import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Cafe } from "@/lib/db/models/Cafe";
import { SupportTicket } from "@/lib/db/models/SupportTicket";
import { requireAdminSession } from "@/lib/session";

export async function GET() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  const [totalCafes, openTickets, inProgressTickets, waitingTickets, resolvedTickets] =
    await Promise.all([
      Cafe.countDocuments(),
      SupportTicket.countDocuments({ status: "open" }),
      SupportTicket.countDocuments({ status: "in_progress" }),
      SupportTicket.countDocuments({ status: "waiting" }),
      SupportTicket.countDocuments({ status: "resolved" }),
    ]);

  const recentTickets = await SupportTicket.find()
    .sort({ lastMessageAt: -1 })
    .limit(5)
    .select("ticketNumber subject cafeName status priority lastMessageAt")
    .lean();

  return NextResponse.json({
    stats: {
      totalCafes,
      openTickets,
      inProgressTickets,
      waitingTickets,
      resolvedTickets,
      activeTickets: openTickets + inProgressTickets + waitingTickets,
    },
    recentTickets,
  });
}
