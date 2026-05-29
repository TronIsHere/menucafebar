import { getSession, getCafeForOwner } from "@/lib/session";
import { DashboardPage, DashboardPageHeader } from "@/components/dashboard/shell";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const session = await getSession();
  const cafe = await getCafeForOwner(session!.user.id);

  return (
    <DashboardPage size="narrow">
      <DashboardPageHeader
        title="تنظیمات کافه"
        description="اطلاعات عمومی، ساعات کاری، میزها و باشگاه مشتریان"
      />
      <SettingsForm cafe={JSON.parse(JSON.stringify(cafe))} />
    </DashboardPage>
  );
}
