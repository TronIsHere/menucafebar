import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { SupportTicket } from "@/lib/db/models/SupportTicket";
import { getCafeForOwner, getEnrichedSession } from "@/lib/session";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await getEnrichedSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) {
    return NextResponse.json({ error: "کافه یافت نشد" }, { status: 404 });
  }

  const { id } = await params;
  await connectDB();
  const ticket = await SupportTicket.findOne({
    _id: id,
    cafeId: cafe._id.toString(),
  }).lean();

  if (!ticket) {
    return NextResponse.json({ error: "تیکت یافت نشد" }, { status: 404 });
  }

  return NextResponse.json({ ticket });
}
