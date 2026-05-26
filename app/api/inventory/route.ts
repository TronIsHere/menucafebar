import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { InventoryItem } from "@/lib/db/models/InventoryItem";
import { getSession, getCafeForOwner } from "@/lib/session";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  unit: z.string().min(1),
  quantity: z.number().min(0),
  lowThreshold: z.number().min(0),
  cost: z.number().min(0).optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await connectDB();
  const items = await InventoryItem.find({ cafeId: cafe._id.toString() })
    .sort({ name: 1 })
    .lean();

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  await connectDB();
  const item = await InventoryItem.create({
    ...result.data,
    cafeId: cafe._id.toString(),
  });

  return NextResponse.json({ item }, { status: 201 });
}
