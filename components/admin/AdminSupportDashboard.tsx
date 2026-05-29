"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardEmptyState } from "@/components/dashboard/primitives";
import {
  formatTicketNumber,
  TicketCategoryLabel,
  TicketPriorityBadge,
  TicketStatusBadge,
} from "@/components/support/TicketBadges";
import { TicketConversation, type TicketMessage } from "@/components/support/TicketConversation";
import { formatJalaliDateTime } from "@/lib/dates/jalali";
import {
  TICKET_PRIORITIES,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUSES,
  TICKET_STATUS_LABELS,
  type TicketCategory,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/support/constants";
import { Headphones, Phone, RefreshCw, Search } from "@/lib/icons/app-icons";
import { SUPPORT_PHONE, SUPPORT_PHONE_TEL } from "@/lib/brand";

interface Ticket {
  _id: string;
  ticketNumber: number;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  cafeName: string;
  ownerPhone?: string;
  messages: TicketMessage[];
  lastMessageAt: string;
  createdAt: string;
}

export default function AdminSupportDashboard() {
  const searchParams = useSearchParams();
  const ticketParam = searchParams.get("ticket");

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search.trim()) params.set("q", search.trim());

      const res = await fetch(`/api/admin/support?${params}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error("خطا در بارگذاری تیکت‌ها");
        return;
      }
      setTickets(data.tickets);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    if (ticketParam) {
      setSelectedId(ticketParam);
    } else if (tickets.length > 0 && !selectedId) {
      setSelectedId(tickets[0]._id);
    }
  }, [ticketParam, tickets, selectedId]);

  const selected = tickets.find((t) => t._id === selectedId) ?? null;

  async function updateTicket(updates: {
    status?: TicketStatus;
    priority?: TicketPriority;
  }) {
    if (!selected) return;

    const res = await fetch(`/api/admin/support/${selected._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "خطا در بروزرسانی");
      return;
    }

    const updated = data.ticket as Ticket;
    setTickets((prev) =>
      prev.map((t) => (t._id === updated._id ? updated : t))
    );
    toast.success("تیکت بروزرسانی شد");
  }

  async function sendMessage(body: string) {
    if (!selected) return;

    const res = await fetch(`/api/admin/support/${selected._id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, status: "waiting" }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "خطا در ارسال پیام");
      throw new Error(data.error);
    }

    const updated = data.ticket as Ticket;
    setTickets((prev) =>
      prev.map((t) => (t._id === updated._id ? updated : t))
    );
    toast.success("پاسخ ارسال شد");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو موضوع، کافه یا شماره تیکت..."
            className="ps-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
            {TICKET_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {TICKET_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={loadTickets} className="cursor-pointer">
          <RefreshCw className="w-4 h-4" />
        </Button>
        <a
          href={SUPPORT_PHONE_TEL}
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline ms-auto"
        >
          <Phone className="w-4 h-4" />
          {SUPPORT_PHONE}
        </a>
      </div>

      {loading ? (
        <div className="text-muted-foreground text-sm py-12 text-center">
          در حال بارگذاری...
        </div>
      ) : tickets.length === 0 ? (
        <DashboardEmptyState
          icon={Headphones}
          title="تیکتی یافت نشد"
          description="هنوز هیچ تیکت پشتیبانی ثبت نشده یا فیلترها نتیجه‌ای ندارند."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {tickets.length} تیکت
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border max-h-[560px] overflow-y-auto">
                {tickets.map((ticket) => (
                  <button
                    key={ticket._id}
                    type="button"
                    onClick={() => setSelectedId(ticket._id)}
                    className={`w-full text-start px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer ${
                      selectedId === ticket._id ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        {formatTicketNumber(ticket.ticketNumber)}
                      </span>
                      <TicketStatusBadge status={ticket.status} />
                    </div>
                    <p className="text-sm font-medium truncate">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {ticket.cafeName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatJalaliDateTime(ticket.lastMessageAt)}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selected && (
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline" className="font-mono">
                        {formatTicketNumber(selected.ticketNumber)}
                      </Badge>
                      <TicketCategoryLabel category={selected.category} />
                      <TicketPriorityBadge priority={selected.priority} />
                    </div>
                    <CardTitle className="text-lg">{selected.subject}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selected.cafeName}
                      {selected.ownerPhone && (
                        <span dir="ltr" className="ms-2">
                          · {selected.ownerPhone}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select
                      value={selected.status}
                      onValueChange={(v) =>
                        updateTicket({ status: v as TicketStatus })
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TICKET_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {TICKET_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={selected.priority}
                      onValueChange={(v) =>
                        updateTicket({ priority: v as TicketPriority })
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TICKET_PRIORITIES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {TICKET_PRIORITY_LABELS[p]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TicketConversation
                  messages={selected.messages}
                  disabled={selected.status === "closed"}
                  onSend={sendMessage}
                  placeholder="پاسخ پشتیبانی را بنویسید..."
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
