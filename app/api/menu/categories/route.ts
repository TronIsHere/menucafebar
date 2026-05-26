import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Category } from "@/lib/db/models/Category";
import { getSession, getCafeForOwner } from "@/lib/session";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "نام دسته‌بندی الزامی است"),
  icon: z.string().optional(),
  order: z.number().optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) return NextResponse.json({ error: "Cafe not found" }, { status: 404 });

  await connectDB();
  const categories = await Category.find({ cafeId: cafe._id.toString() })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) return NextResponse.json({ error: "Cafe not found" }, { status: 404 });

  const body = await request.json();
  const result = categorySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  await connectDB();
  const count = await Category.countDocuments({ cafeId: cafe._id.toString() });
  const category = await Category.create({
    ...result.data,
    cafeId: cafe._id.toString(),
    order: result.data.order ?? count,
  });

  return NextResponse.json({ category }, { status: 201 });
}
