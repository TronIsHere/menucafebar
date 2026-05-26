import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Category } from "@/lib/db/models/Category";
import { MenuItem } from "@/lib/db/models/MenuItem";
import { getSession, getCafeForOwner } from "@/lib/session";

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

  await connectDB();
  const category = await Category.findOneAndUpdate(
    { _id: id, cafeId: cafe._id.toString() },
    { $set: body },
    { new: true }
  );

  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ category });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) return NextResponse.json({ error: "Cafe not found" }, { status: 404 });

  const { id } = await params;
  await connectDB();

  await Promise.all([
    Category.findOneAndDelete({ _id: id, cafeId: cafe._id.toString() }),
    MenuItem.deleteMany({ categoryId: id, cafeId: cafe._id.toString() }),
  ]);

  return NextResponse.json({ success: true });
}
