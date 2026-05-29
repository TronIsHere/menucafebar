"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStatCard } from "@/components/dashboard/primitives";
import { formatNum } from "@/components/dashboard/format";
import {
  formatTicketNumber,
  TicketStatusBadge,
} from "@/components/support/TicketBadges";
import { formatJalaliDateTime } from "@/lib/dates/jalali";
import type { TicketStatus } from "@/lib/support/constants";
import { Coffee, Headphones, MessageCircle, Users } from "@/lib/icons/app-icons";

interface Stats {
  totalCafes: number;
  openTickets: number;
  inProgressTickets: number;
  waitingTickets: number;
  resolvedTickets: number;
  activeTickets: number;
}

interface RecentTicket {
  _id: string;
  ticketNumber: number;
  subject: string;
  cafeName: string;
  status: TicketStatus;
  lastMessageAt: string;
}

export default function AdminHomeDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats);
        setRecentTickets(data.recentTickets ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-muted-foreground text-sm py-12 text-center">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          title="کافه‌های فعال"
          value={formatNum(stats?.totalCafes ?? 0)}
          icon={Coffee}
          color="text-blue-600"
          border="border-blue-200 dark:border-blue-900"
        />
        <DashboardStatCard
          title="تیکت‌های فعال"
          value={formatNum(stats?.activeTickets ?? 0)}
          icon={Headphones}
          color="text-orange-600"
          border="border-orange-200 dark:border-orange-900"
          highlight={(stats?.activeTickets ?? 0) > 0}
        />
        <DashboardStatCard
          title="در انتظار پاسخ"
          value={formatNum(stats?.waitingTickets ?? 0)}
          icon={MessageCircle}
          color="text-violet-600"
          border="border-violet-200 dark:border-violet-900"
        />
        <DashboardStatCard
          title="حل شده"
          value={formatNum(stats?.resolvedTickets ?? 0)}
          icon={Users}
          color="text-emerald-600"
          border="border-emerald-200 dark:border-emerald-900"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">آخرین تیکت‌ها</CardTitle>
          <Link
            href="/admin/support"
            className="text-sm text-primary hover:underline"
          >
            مشاهده همه
          </Link>
        </CardHeader>
        <CardContent>
          {recentTickets.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              تیکتی ثبت نشده است
            </p>
          ) : (
            <div className="divide-y divide-border">
              {recentTickets.map((ticket) => (
                <Link
                  key={ticket._id}
                  href={`/admin/support?ticket=${ticket._id}`}
                  className="flex items-center justify-between gap-4 py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-muted-foreground">
                        {formatTicketNumber(ticket.ticketNumber)}
                      </span>
                      <TicketStatusBadge status={ticket.status} />
                    </div>
                    <p className="text-sm font-medium truncate">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground">{ticket.cafeName}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatJalaliDateTime(ticket.lastMessageAt)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
