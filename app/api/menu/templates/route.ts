import { NextResponse } from "next/server";
import { MENU_TEMPLATES } from "@/lib/menu-templates";

export async function GET() {
  return NextResponse.json({ templates: MENU_TEMPLATES });
}
