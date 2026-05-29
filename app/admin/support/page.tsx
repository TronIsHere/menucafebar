import { Suspense } from "react";
import { DashboardPage, DashboardPageHeader } from "@/components/dashboard/shell";
import AdminSupportDashboard from "@/components/admin/AdminSupportDashboard";

export default function AdminSupportPage() {
  return (
    <DashboardPage size="full">
      <DashboardPageHeader
        title="تیکت‌های پشتیبانی"
        description="مدیریت و پاسخ به درخواست‌های پشتیبانی کافه‌ها"
      />
      <Suspense fallback={<div className="text-muted-foreground text-sm py-12 text-center">در حال بارگذاری...</div>}>
        <AdminSupportDashboard />
      </Suspense>
    </DashboardPage>
  );
}
