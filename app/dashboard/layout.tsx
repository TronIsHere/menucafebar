import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession, getCafeForOwner } from "@/lib/session";
import { Sidebar, MobileDashboardHeader } from "@/components/dashboard/Sidebar";
import { DashboardNavOverlay } from "@/components/dashboard/DashboardNavOverlay";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe?.isOnboardingComplete) redirect("/onboarding");

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar cafeName={cafe?.name} />
      <div className="flex flex-col flex-1 min-w-0">
        <MobileDashboardHeader cafeName={cafe?.name} />
        <main className="flex-1 overflow-auto min-w-0">
          <Suspense fallback={null}>
            <DashboardNavOverlay>{children}</DashboardNavOverlay>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
