import { NextResponse } from "next/server";
import { isAdminRole } from "@/lib/auth/admin";
import { getEnrichedSession, getCafeForOwner } from "@/lib/session";

export async function GET() {
  const session = await getEnrichedSession();
  if (!session) {
    return NextResponse.json({ redirect: "/login" });
  }

  const cafe = await getCafeForOwner(session.user.id);

  if (!cafe?.isOnboardingComplete) {
    if (isAdminRole(session.user.role)) {
      return NextResponse.json({ redirect: "/admin", role: "admin" });
    }
    return NextResponse.json({ redirect: "/onboarding", role: session.user.role });
  }

  return NextResponse.json({
    redirect: "/dashboard",
    role: session.user.role,
  });
}
