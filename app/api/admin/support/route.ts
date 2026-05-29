import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { SupportTicket } from "@/lib/db/models/SupportTicket";
import { requireAdminSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (status && status !== "all") {
    filter.status = status;
  }
  if (q) {
    filter.$or = [
      { subject: { $regex: q, $options: "i" } },
      { cafeName: { $regex: q, $options: "i" } },
      { ticketNumber: isNaN(Number(q)) ? -1 : Number(q) },
    ];
  }

  const tickets = await SupportTicket.find(filter)
    .sort({ lastMessageAt: -1 })
    .lean();

  return NextResponse.json({ tickets });
}
