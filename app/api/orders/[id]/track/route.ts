import { NextRequest, NextResponse } from "next/server";
import { getOrderForCustomer } from "@/lib/orders/get-order-for-customer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cafeSlug = new URL(request.url).searchParams.get("cafeSlug");

  if (!cafeSlug) {
    return NextResponse.json({ error: "cafeSlug is required" }, { status: 400 });
  }

  const result = await getOrderForCustomer(id, cafeSlug);
  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    order: result.order,
    cafeName: result.cafeName,
  });
}
