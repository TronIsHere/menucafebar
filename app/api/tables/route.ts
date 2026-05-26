import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Cafe } from "@/lib/db/models/Cafe";
import { getSession, getCafeForOwner } from "@/lib/session";
import { getOccupiedTableNumbers } from "@/lib/tables/occupancy";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cafeSlug = searchParams.get("cafeSlug");

  await connectDB();

  let cafeId: string;
  let tableNumbers: string[];

  if (cafeSlug) {
    const cafe = await Cafe.findOne({ slug: cafeSlug, isOnboardingComplete: true }).lean();
    if (!cafe) return NextResponse.json({ error: "Cafe not found" }, { status: 404 });
    cafeId = cafe._id.toString();
    tableNumbers = cafe.tableNumbers ?? [];
  } else {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const cafe = await getCafeForOwner(session.user.id);
    if (!cafe) return NextResponse.json({ error: "Cafe not found" }, { status: 404 });
    cafeId = cafe._id.toString();
    tableNumbers = cafe.tableNumbers ?? [];
  }

  const occupied = await getOccupiedTableNumbers(cafeId);

  return NextResponse.json({
    tableNumbers,
    occupied,
  });
}
