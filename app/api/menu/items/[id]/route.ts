import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { MenuItem } from "@/lib/db/models/MenuItem";
import { getSession, getCafeForOwner } from "@/lib/session";
import { z } from "zod";

const patchSchema = z.object({
  categoryId: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  imageUrl: z.union([z.string().url(), z.literal("")]).optional(),
  available: z.boolean().optional(),
  order: z.number().optional(),
});

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
  const result = patchSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  const updates = { ...result.data };
  delete updates.imageUrl;

  const updateQuery: Record<string, unknown> = { $set: updates };
  if (result.data.imageUrl === "") {
    updateQuery.$unset = { imageUrl: "" };
  } else if (result.data.imageUrl) {
    (updateQuery.$set as Record<string, unknown>).imageUrl = result.data.imageUrl;
  }

  await connectDB();
  const item = await MenuItem.findOneAndUpdate(
    { _id: id, cafeId: cafe._id.toString() },
    updateQuery,
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
  if (!cafe) return NextResponse.json({ error: "Cafe not found" }, { status: 404 });

  const { id } = await params;
  await connectDB();
  await MenuItem.findOneAndDelete({ _id: id, cafeId: cafe._id.toString() });

  return NextResponse.json({ success: true });
}
