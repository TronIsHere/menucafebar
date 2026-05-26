import { redirect } from "next/navigation";
import { getSession, getCafeForOwner } from "@/lib/session";
import OnboardingWizard from "./OnboardingWizard";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const cafe = await getCafeForOwner(session.user.id);
  if (cafe?.isOnboardingComplete) redirect("/dashboard");

  return <OnboardingWizard />;
}
