import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Cafe } from "@/lib/db/models/Cafe";
import { getSession } from "@/lib/session";
import { isValidTemplateKey } from "@/lib/menu-templates";
import { z } from "zod";

const cafeSchema = z.object({
  name: z.string().min(2, "نام کافه باید حداقل ۲ کاراکتر باشد"),
  address: z.string().min(5, "آدرس باید حداقل ۵ کاراکتر باشد"),
  city: z.string().min(2, "شهر را وارد کنید"),
  phone: z.string().min(10, "شماره تلفن معتبر وارد کنید"),
  openTime: z.string().regex(/^\d{2}:\d{2}$/, "فرمت ساعت اشتباه است"),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/, "فرمت ساعت اشتباه است"),
  fridayOpenTime: z.string().regex(/^\d{2}:\d{2}$/, "فرمت ساعت اشتباه است").optional(),
  fridayCloseTime: z.string().regex(/^\d{2}:\d{2}$/, "فرمت ساعت اشتباه است").optional(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "فقط حروف انگلیسی کوچک، اعداد و خط تیره").optional(),
  tableNumbers: z.array(z.string().min(1)).optional(),
  customerClubDiscountEnabled: z.boolean().optional(),
  newCustomerDiscountPercent: z.number().min(0).max(100).optional(),
});

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .slice(0, 40);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = cafeSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  await connectDB();

  const existing = await Cafe.findOne({ ownerId: session.user.id });
  if (existing) {
    return NextResponse.json(
      { error: "شما قبلاً کافه ثبت کرده‌اید" },
      { status: 409 }
    );
  }

  // Check slug uniqueness
  let slug = result.data.slug || generateSlug(result.data.name);
  const slugExists = await Cafe.findOne({ slug });
  if (slugExists) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const cafe = await Cafe.create({
    ...result.data,
    slug,
    ownerId: session.user.id,
    isOnboardingComplete: true,
  });

  return NextResponse.json({ cafe }, { status: 201 });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const cafe = await Cafe.findOne({ ownerId: session.user.id }).lean();
  return NextResponse.json({ cafe });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (body.templateKey !== undefined && !isValidTemplateKey(body.templateKey)) {
    return NextResponse.json({ error: "قالب نامعتبر است" }, { status: 400 });
  }

  await connectDB();

  const cafe = await Cafe.findOneAndUpdate(
    { ownerId: session.user.id },
    { $set: body },
    { new: true }
  );

  if (!cafe) {
    return NextResponse.json({ error: "کافه یافت نشد" }, { status: 404 });
  }

  return NextResponse.json({ cafe });
}
