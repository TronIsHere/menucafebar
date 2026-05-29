import { connectDB } from "@/lib/db/mongoose";
import { SupportTicket } from "@/lib/db/models/SupportTicket";
import { getSession, getCafeForOwner } from "@/lib/session";
import { DashboardPage, DashboardPageHeader } from "@/components/dashboard/shell";
import SupportDashboard from "@/components/dashboard/SupportDashboard";

export default async function SupportPage() {
  const session = await getSession();
  const cafe = await getCafeForOwner(session!.user.id);

  await connectDB();
  const tickets = await SupportTicket.find({ cafeId: cafe!._id.toString() })
    .sort({ lastMessageAt: -1 })
    .lean();

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="پشتیبانی"
        description="تیکت پشتیبانی، پیگیری درخواست‌ها و تماس با تیم منو کافه"
      />
      <SupportDashboard initialTickets={JSON.parse(JSON.stringify(tickets))} />
    </DashboardPage>
  );
}
