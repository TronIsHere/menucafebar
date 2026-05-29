import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LandingJsonLd } from "@/components/seo/LandingJsonLd";
import LandingPage from "@/components/landing/LandingPage";
import { landingMetadata } from "@/lib/seo";
import { getSession, getCafeForOwner } from "@/lib/session";

export const metadata: Metadata = landingMetadata;

export default async function HomePage() {
  const session = await getSession();

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
    redirect("/onboarding");
  }

  redirect("/dashboard");
}
