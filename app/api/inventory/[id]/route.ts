import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { InventoryItem } from "@/lib/db/models/InventoryItem";
import { getSession, getCafeForOwner } from "@/lib/session";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { id } = await params;
  const body = await request.json();

  await connectDB();
  const item = await InventoryItem.findOneAndUpdate(
    { _id: id, cafeId: cafe._id.toString() },
    { $set: body },
    { new: true }
  );

  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { id } = await params;
  await connectDB();
  await InventoryItem.findOneAndDelete({ _id: id, cafeId: cafe._id.toString() });

  return NextResponse.json({ success: true });
}
