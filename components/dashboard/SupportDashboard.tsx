"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { SUPPORT_PHONE, SUPPORT_PHONE_TEL } from "@/lib/brand";
import {
  TICKET_CATEGORIES,
  TICKET_CATEGORY_LABELS,
  TICKET_PRIORITIES,
  TICKET_PRIORITY_LABELS,
  type TicketCategory,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/support/constants";
import { formatJalaliDateTime } from "@/lib/dates/jalali";
import { Headphones, MessageCircle, Phone, Plus } from "@/lib/icons/app-icons";

interface Ticket {
  _id: string;
  ticketNumber: number;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  messages: TicketMessage[];
  lastMessageAt: string;
  createdAt: string;
}

interface Props {
  initialTickets: Ticket[];
}

export default function SupportDashboard({ initialTickets }: Props) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialTickets[0]?._id ?? null
  );
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    category: "general" as TicketCategory,
    priority: "normal" as TicketPriority,
    message: "",
  });

  const selected = tickets.find((t) => t._id === selectedId) ?? null;
  const openCount = tickets.filter((t) =>
    ["open", "in_progress", "waiting"].includes(t.status)
  ).length;

  async function createTicket() {
    if (!form.subject.trim() || !form.message.trim()) {
      toast.error("موضوع و پیام را وارد کنید");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "خطا در ثبت تیکت");
        return;
      }

      const ticket = data.ticket as Ticket;
      setTickets((prev) => [ticket, ...prev]);
      setSelectedId(ticket._id);
      setCreateOpen(false);
      setForm({ subject: "", category: "general", priority: "normal", message: "" });
      toast.success("تیکت پشتیبانی ثبت شد");
    } catch {
      toast.error("خطا در ثبت تیکت");
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(body: string) {
    if (!selected) return;

    const res = await fetch(`/api/support/${selected._id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
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
    toast.success("پیام ارسال شد");
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              تیکت‌های فعال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{openCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              تماس تلفنی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={SUPPORT_PHONE_TEL}
              className="text-lg font-bold text-primary hover:underline"
              dir="ltr"
            >
              {SUPPORT_PHONE}
            </a>
            <p className="text-xs text-muted-foreground mt-1">
              شنبه تا پنج‌شنبه، ۹ تا ۱۸
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-col justify-center">
          <CardContent className="pt-6">
            <Button
              className="w-full cursor-pointer"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="w-4 h-4 me-2" />
              تیکت جدید
            </Button>
          </CardContent>
        </Card>
      </div>

      {tickets.length === 0 ? (
        <DashboardEmptyState
          icon={Headphones}
          title="هنوز تیکتی ثبت نکرده‌اید"
          description="برای دریافت کمک از تیم پشتیبانی، یک تیکت جدید ایجاد کنید یا با شماره پشتیبانی تماس بگیرید."
          action={
            <Button onClick={() => setCreateOpen(true)} className="cursor-pointer">
              <Plus className="w-4 h-4 me-2" />
              ایجاد تیکت
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">تیکت‌های شما</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border max-h-[520px] overflow-y-auto">
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
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-mono">
                        {formatTicketNumber(selected.ticketNumber)}
                      </Badge>
                      <TicketCategoryLabel category={selected.category} />
                    </div>
                    <CardTitle className="text-lg">{selected.subject}</CardTitle>
                    <div className="flex items-center gap-3 mt-2">
                      <TicketStatusBadge status={selected.status} />
                      <TicketPriorityBadge priority={selected.priority} />
                    </div>
                  </div>
                  <a
                    href={SUPPORT_PHONE_TEL}
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    {SUPPORT_PHONE}
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                <TicketConversation
                  messages={selected.messages}
                  disabled={selected.status === "closed"}
                  onSend={sendMessage}
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تیکت پشتیبانی جدید</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">موضوع</Label>
              <Input
                id="subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="مثلاً: مشکل در چاپ فیش آشپزخانه"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>دسته‌بندی</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm({ ...form, category: v as TicketCategory })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {TICKET_CATEGORY_LABELS[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>اولویت</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) =>
                    setForm({ ...form, priority: v as TicketPriority })
                  }
                >
                  <SelectTrigger>
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
            <div className="space-y-2">
              <Label htmlFor="message">شرح مشکل</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                placeholder="لطفاً مشکل خود را با جزئیات توضیح دهید..."
              />
            </div>
            <Button
              className="w-full cursor-pointer"
              onClick={createTicket}
              disabled={loading}
            >
              {loading ? "در حال ثبت..." : "ثبت تیکت"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
