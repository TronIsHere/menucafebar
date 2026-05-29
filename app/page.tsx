import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LandingJsonLd } from "@/components/seo/LandingJsonLd";
import LandingPage from "@/components/landing/LandingPage";
import { landingMetadata } from "@/lib/seo";
import { getEnrichedSession, getCafeForOwner } from "@/lib/session";
import { isAdminRole } from "@/lib/auth/admin";

export const metadata: Metadata = landingMetadata;

export default async function HomePage() {
  const session = await getEnrichedSession();

  if (!session) {
    return (
      <>
        <LandingJsonLd />
        <LandingPage />
      </>
    );
  }

  const cafe = await getCafeForOwner(session.user.id);

  if (!cafe?.isOnboardingComplete) {
    if (isAdminRole(session.user.role)) {
      redirect("/admin");
    }
    redirect("/onboarding");
  }

  redirect("/dashboard");
}
