import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { MenuItem } from "@/lib/db/models/MenuItem";
import { getSession, getCafeForOwner } from "@/lib/session";
import { z } from "zod";

const itemSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1, "نام آیتم الزامی است"),
  description: z.string().optional(),
  price: z.number().min(0, "قیمت نمی‌تواند منفی باشد"),
  imageUrl: z.union([z.string().url(), z.literal("")]).optional(),
  available: z.boolean().optional(),
  order: z.number().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) return NextResponse.json({ error: "Cafe not found" }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");

  await connectDB();
  const query: Record<string, string> = { cafeId: cafe._id.toString() };
  if (categoryId) query.categoryId = categoryId;

  const items = await MenuItem.find(query).sort({ order: 1, createdAt: 1 }).lean();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) return NextResponse.json({ error: "Cafe not found" }, { status: 404 });

  const body = await request.json();
  const result = itemSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  await connectDB();
  const count = await MenuItem.countDocuments({
    cafeId: cafe._id.toString(),
    categoryId: result.data.categoryId,
  });

  const item = await MenuItem.create({
    ...result.data,
    cafeId: cafe._id.toString(),
    imageUrl: result.data.imageUrl || undefined,
    available: result.data.available ?? true,
    order: result.data.order ?? count,
  });

  return NextResponse.json({ item }, { status: 201 });
}
