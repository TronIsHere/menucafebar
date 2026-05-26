import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { MenuTemplate } from "@/lib/db/models/MenuTemplate";

export async function GET() {
  await connectDB();
  const templates = await MenuTemplate.find().lean();
  return NextResponse.json({ templates });
}
