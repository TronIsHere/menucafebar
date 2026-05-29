import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getEnrichedSession, getCafeForOwner } from "@/lib/session";
import { isAdminRole } from "@/lib/auth/admin";
import { AdminSidebar, AdminMobileHeader } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "پنل مدیریت | منو کافه بار",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getEnrichedSession();
  if (!session) redirect("/login?redirect=/admin");

  if (!isAdminRole(session.user.role)) {
    redirect("/dashboard");
  }

  const cafe = await getCafeForOwner(session.user.id);
  const hasDashboard = Boolean(cafe?.isOnboardingComplete);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar hasDashboard={hasDashboard} />
      <div className="flex flex-col flex-1 min-w-0">
        <AdminMobileHeader hasDashboard={hasDashboard} />
        <main className="flex-1 overflow-auto min-w-0">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
