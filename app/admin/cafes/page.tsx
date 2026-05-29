import { connectDB } from "@/lib/db/mongoose";
import { Cafe } from "@/lib/db/models/Cafe";
import { SupportTicket } from "@/lib/db/models/SupportTicket";
import { DashboardPage, DashboardPageHeader } from "@/components/dashboard/shell";
import AdminCafesList from "@/components/admin/AdminCafesList";

export default async function AdminCafesPage() {
  await connectDB();

  const cafes = await Cafe.find()
    .sort({ createdAt: -1 })
    .select("name slug city phone ownerId createdAt isOnboardingComplete")
    .lean();

  const ticketCounts = await SupportTicket.aggregate([
    { $group: { _id: "$cafeId", count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(
    ticketCounts.map((t) => [t._id, t.count as number])
  );

  const cafesWithCounts = cafes.map((c) => ({
    ...c,
    ticketCount: countMap[c._id.toString()] ?? 0,
  }));

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="کافه‌ها"
        description="لیست کافه‌های ثبت‌شده در پلتفرم"
      />
      <AdminCafesList cafes={JSON.parse(JSON.stringify(cafesWithCounts))} />
    </DashboardPage>
  );
}
