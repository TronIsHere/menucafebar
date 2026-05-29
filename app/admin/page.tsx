import { DashboardPage, DashboardPageHeader } from "@/components/dashboard/shell";
import AdminHomeDashboard from "@/components/admin/AdminHomeDashboard";

export default function AdminPage() {
  return (
    <DashboardPage>
      <DashboardPageHeader
        title="داشبورد مدیریت"
        description="نمای کلی پلتفرم، تیکت‌های پشتیبانی و کافه‌های فعال"
      />
      <AdminHomeDashboard />
    </DashboardPage>
  );
}
