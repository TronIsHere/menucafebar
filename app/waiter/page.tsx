import { redirect } from "next/navigation";
import { getSession, getCafeForOwner } from "@/lib/session";
import { connectDB } from "@/lib/db/mongoose";
import { Category } from "@/lib/db/models/Category";
import { MenuItem } from "@/lib/db/models/MenuItem";
import { Order } from "@/lib/db/models/Order";
import WaiterPageClient from "./WaiterPageClient";

export default async function WaiterPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) redirect("/onboarding");

  await connectDB();
  const [categories, items, orders] = await Promise.all([
    Category.find({ cafeId: cafe._id.toString() }).sort({ order: 1 }).lean(),
    MenuItem.find({ cafeId: cafe._id.toString(), available: true })
      .sort({ order: 1 })
      .lean(),
    Order.find({
      cafeId: cafe._id.toString(),
      status: { $in: ["pending", "preparing", "ready"] },
    })
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <h1 className="text-lg font-bold">{cafe.name} · حالت پیشخدمت</h1>
          <a
            href="/dashboard/orders"
            className="text-sm text-primary hover:underline"
          >
            تابلوی سفارشات
          </a>
        </div>
      </header>
      <WaiterPageClient
        cafeSlug={cafe.slug}
        categories={JSON.parse(JSON.stringify(categories))}
        items={JSON.parse(JSON.stringify(items))}
        tableNumbers={cafe.tableNumbers ?? []}
        initialOrders={JSON.parse(JSON.stringify(orders))}
      />
    </div>
  );
}
