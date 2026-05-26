import { getSession, getCafeForOwner } from "@/lib/session";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const session = await getSession();
  const cafe = await getCafeForOwner(session!.user.id);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">تنظیمات کافه</h1>
      <SettingsForm cafe={JSON.parse(JSON.stringify(cafe))} />
    </div>
  );
}
