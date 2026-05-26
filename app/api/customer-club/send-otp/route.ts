import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Cafe } from "@/lib/db/models/Cafe";
import { formatPhone, isValidPhone } from "@/lib/customer-club/phone";
import { sendOtp } from "@/lib/customer-club/verification";
import { z } from "zod";

const schema = z.object({
  cafeSlug: z.string().min(1),
  phone: z.string().min(10),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  const phone = formatPhone(result.data.phone);
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "شماره موبایل معتبر وارد کنید" }, { status: 400 });
  }

  await connectDB();
  const cafe = await Cafe.findOne({
    slug: result.data.cafeSlug,
    isOnboardingComplete: true,
  }).lean();
  if (!cafe) {
    return NextResponse.json({ error: "کافه یافت نشد" }, { status: 404 });
  }

  if (!cafe.customerClubDiscountEnabled) {
    return NextResponse.json(
      { error: "تخفیف باشگاه مشتریان فعال نیست" },
      { status: 400 }
    );
  }

  await sendOtp(cafe._id.toString(), phone);

  return NextResponse.json({ ok: true });
}
