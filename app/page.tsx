import { redirect } from "next/navigation";
import { getSession, getCafeForOwner } from "@/lib/session";
import LandingPage from "@/components/landing/LandingPage";

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    return <LandingPage />;
  }

  const cafe = await getCafeForOwner(session.user.id);

  if (!cafe?.isOnboardingComplete) {
    redirect("/onboarding");
  }

  redirect("/dashboard");
}
