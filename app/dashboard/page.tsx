import { getSession, getCafeForOwner } from "@/lib/session";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models/Order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

function formatToman(amount: number) {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
}

export default async function DashboardPage() {
  const session = await getSession();
  const cafe = await getCafeForOwner(session!.user.id);

  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalOrders, pendingOrders, todayOrders, recentOrders] =
    await Promise.all([
      Order.countDocuments({ cafeId: cafe!._id.toString() }),
      Order.countDocuments({
        cafeId: cafe!._id.toString(),
        status: { $in: ["pending", "preparing"] },
      }),
      Order.find({
        cafeId: cafe!._id.toString(),
        createdAt: { $gte: today },
        status: { $ne: "cancelled" },
      }),
      Order.find({ cafeId: cafe!._id.toString() })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      title: "سفارشات در حال انجام",
      value: pendingOrders,
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-50",
      href: "/dashboard/orders",
    },
    {
      title: "سفارشات امروز",
      value: todayOrders.length,
      icon: ShoppingBag,
      color: "text-blue-500",
      bg: "bg-blue-50",
      href: "/dashboard/orders",
    },
    {
      title: "درآمد امروز",
      value: formatToman(todayRevenue),
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-50",
      href: "/dashboard/analytics",
    },
    {
      title: "کل سفارشات",
      value: totalOrders,
      icon: CheckCircle,
      color: "text-purple-500",
      bg: "bg-purple-50",
      href: "/dashboard/analytics",
    },
  ];

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: { label: "جدید", variant: "default" },
    preparing: { label: "در حال آماده‌سازی", variant: "secondary" },
    ready: { label: "آماده", variant: "outline" },
    completed: { label: "تکمیل شده", variant: "outline" },
    cancelled: { label: "لغو شده", variant: "destructive" },
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">خوش آمدید 👋</h1>
        <p className="text-muted-foreground text-sm sm:text-base">خلاصه وضعیت کافه {cafe?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-lg sm:text-2xl font-bold mt-1 truncate">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-2.5 sm:p-3 rounded-xl shrink-0`}>
                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">آخرین سفارشات</CardTitle>
          <Link
            href="/dashboard/orders"
            className="text-sm text-primary hover:underline"
          >
            مشاهده همه
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              هنوز سفارشی ثبت نشده است
            </p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order._id.toString()}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {order.tableNumber || "#"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {order.items.length} آیتم
                        {order.tableNumber && ` (میز ${order.tableNumber})`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatToman(order.total)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusMap[order.status]?.variant ?? "outline"} className="self-start sm:self-auto">
                    {statusMap[order.status]?.label ?? order.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
