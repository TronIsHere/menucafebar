"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  formatJalaliDate,
  formatJalaliDateTime,
  formatJalaliTime,
  toJalaliInputValue,
} from "@/lib/dates/jalali";
import {
  type Order,
  formatToman,
  statusLabels,
} from "@/lib/orders/lifecycle";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Receipt,
  Search,
  ShoppingBag,
  XCircle,
  CheckCircle2,
  Banknote,
} from "@/lib/icons/app-icons";

interface HistoryStats {
  orderCount: number;
  totalRevenue: number;
  completedCount: number;
  cancelledCount: number;
  unpaidCount: number;
}

interface Props {
  orders: Order[];
  stats: HistoryStats;
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  filters: {
    preset: string;
    from: string;
    to: string;
    status: string;
    source: string;
    isPaid: string;
    table: string;
  };
}

const statusBadgeVariant: Record<
  Order["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "default",
  preparing: "secondary",
  ready: "outline",
  completed: "outline",
  cancelled: "destructive",
};

function itemsSummary(order: Order) {
  const count = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const names = order.items.map((i) => i.name).slice(0, 2).join("، ");
  const extra = order.items.length > 2 ? ` +${order.items.length - 2}` : "";
  return { count, text: names + extra };
}

export default function OrderHistoryTable({
  orders,
  stats,
  total,
  page,
  totalPages,
  limit,
  filters,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Order | null>(null);
  const [localFilters, setLocalFilters] = useState(filters);

  const applyFilters = useCallback(
    (updates: Partial<typeof filters>) => {
      const next = { ...localFilters, ...updates };
      setLocalFilters(next);

      const params = new URLSearchParams();
      if (next.preset && next.preset !== "month") params.set("preset", next.preset);
      if (next.from) params.set("from", next.from);
      if (next.to) params.set("to", next.to);
      if (next.status && next.status !== "all") params.set("status", next.status);
      if (next.source && next.source !== "all") params.set("source", next.source);
      if (next.isPaid && next.isPaid !== "all") params.set("isPaid", next.isPaid);
      if (next.table) params.set("table", next.table);

      startTransition(() => {
        router.push(`/dashboard/orders/history?${params.toString()}`);
      });
    },
    [localFilters, router]
  );

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));
    startTransition(() => {
      router.push(`/dashboard/orders/history?${params.toString()}`);
    });
  }

  function clearFilters() {
    setLocalFilters({
      preset: "month",
      from: "",
      to: "",
      status: "all",
      source: "all",
      isPaid: "all",
      table: "",
    });
    startTransition(() => {
      router.push("/dashboard/orders/history");
    });
  }

  const todayJalali = toJalaliInputValue(new Date());

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">کل سفارشات</p>
              <p className="text-lg font-bold">
                {new Intl.NumberFormat("fa-IR").format(stats.orderCount)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Banknote className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">مجموع فروش</p>
              <p className="text-sm font-bold">{formatToman(stats.totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <CheckCircle2 className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">تحویل شده</p>
              <p className="text-lg font-bold">
                {new Intl.NumberFormat("fa-IR").format(stats.completedCount)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <XCircle className="w-5 h-5 text-red-700" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">لغو شده</p>
              <p className="text-lg font-bold">
                {new Intl.NumberFormat("fa-IR").format(stats.cancelledCount)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <Receipt className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">پرداخت نشده</p>
              <p className="text-lg font-bold">
                {new Intl.NumberFormat("fa-IR").format(stats.unpaidCount)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            فیلترها
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { value: "today", label: "امروز" },
              { value: "week", label: "این هفته" },
              { value: "month", label: "این ماه" },
              { value: "all", label: "همه" },
            ].map((p) => (
              <Button
                key={p.value}
                size="sm"
                variant={localFilters.preset === p.value ? "default" : "outline"}
                onClick={() =>
                  applyFilters({ preset: p.value, from: "", to: "" })
                }
              >
                {p.label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label>از تاریخ (شمسی)</Label>
              <Input
                value={localFilters.from}
                onChange={(e) =>
                  setLocalFilters((f) => ({ ...f, from: e.target.value, preset: "custom" }))
                }
                placeholder={todayJalali}
                dir="ltr"
                className="text-start"
              />
            </div>
            <div className="space-y-1">
              <Label>تا تاریخ (شمسی)</Label>
              <Input
                value={localFilters.to}
                onChange={(e) =>
                  setLocalFilters((f) => ({ ...f, to: e.target.value, preset: "custom" }))
                }
                placeholder={todayJalali}
                dir="ltr"
                className="text-start"
              />
            </div>
            <div className="space-y-1">
              <Label>وضعیت</Label>
              <Select
                value={localFilters.status}
                onValueChange={(v) => applyFilters({ status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="completed">تحویل داده شد</SelectItem>
                  <SelectItem value="cancelled">لغو شده</SelectItem>
                  <SelectItem value="pending">جدید</SelectItem>
                  <SelectItem value="preparing">در حال آماده‌سازی</SelectItem>
                  <SelectItem value="ready">آماده تحویل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>منبع سفارش</Label>
              <Select
                value={localFilters.source}
                onValueChange={(v) => applyFilters({ source: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="customer">آنلاین (مشتری)</SelectItem>
                  <SelectItem value="waiter">پیشخدمت</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>پرداخت</Label>
              <Select
                value={localFilters.isPaid}
                onValueChange={(v) => applyFilters({ isPaid: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="true">پرداخت شده</SelectItem>
                  <SelectItem value="false">پرداخت نشده</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>شماره میز</Label>
              <Input
                value={localFilters.table}
                onChange={(e) =>
                  setLocalFilters((f) => ({ ...f, table: e.target.value }))
                }
                placeholder="مثلاً ۵"
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyFilters({ table: localFilters.table });
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                applyFilters({
                  from: localFilters.from,
                  to: localFilters.to,
                  table: localFilters.table,
                  preset: localFilters.from || localFilters.to ? "custom" : localFilters.preset,
                })
              }
              disabled={isPending}
              className="gap-2"
            >
              <Search className="w-4 h-4" />
              اعمال فیلتر
            </Button>
            <Button variant="outline" onClick={clearFilters} disabled={isPending}>
              پاک کردن
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base">لیست سفارشات</CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Intl.NumberFormat("fa-IR").format(total)} سفارش
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              سفارشی با این فیلترها یافت نشد
            </p>
          ) : (
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>تاریخ (شمسی)</TableHead>
                    <TableHead>ساعت</TableHead>
                    <TableHead>شماره</TableHead>
                    <TableHead>میز</TableHead>
                    <TableHead>مشتری</TableHead>
                    <TableHead>آیتم‌ها</TableHead>
                    <TableHead>مبلغ</TableHead>
                    <TableHead>وضعیت</TableHead>
                    <TableHead>منبع</TableHead>
                    <TableHead>پرداخت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const summary = itemsSummary(order);
                    return (
                      <TableRow
                        key={order._id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelected(order)}
                      >
                        <TableCell className="font-medium whitespace-nowrap">
                          {formatJalaliDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {formatJalaliTime(order.createdAt)}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                            #{order._id.slice(-4).toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>{order.tableNumber ?? "—"}</TableCell>
                        <TableCell>{order.customerName ?? "—"}</TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Intl.NumberFormat("fa-IR").format(summary.count)} عدد
                          </span>
                          <span className="text-xs text-muted-foreground block truncate max-w-[140px]">
                            {summary.text}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatToman(order.total)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant[order.status]} className="text-xs">
                            {statusLabels[order.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {order.source === "customer" ? "آنلاین" : "پیشخدمت"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.status === "completed" ? (
                            order.isPaid ? (
                              <Badge className="text-xs bg-green-600">پرداخت شده</Badge>
                            ) : (
                              <Badge variant="destructive" className="text-xs">
                                پرداخت نشده
                              </Badge>
                            )
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                صفحه {new Intl.NumberFormat("fa-IR").format(page)} از{" "}
                {new Intl.NumberFormat("fa-IR").format(totalPages)}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1 || isPending}
                  onClick={() => goToPage(page - 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                  قبلی
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= totalPages || isPending}
                  onClick={() => goToPage(page + 1)}
                >
                  بعدی
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">
                    #{selected._id.slice(-4).toUpperCase()}
                  </span>
                  جزئیات سفارش
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-muted-foreground text-xs">تاریخ</p>
                    <p className="font-medium">{formatJalaliDate(selected.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">ساعت</p>
                    <p className="font-medium">{formatJalaliDateTime(selected.createdAt)}</p>
                  </div>
                  {selected.tableNumber && (
                    <div>
                      <p className="text-muted-foreground text-xs">میز</p>
                      <p className="font-medium">{selected.tableNumber}</p>
                    </div>
                  )}
                  {selected.customerName && (
                    <div>
                      <p className="text-muted-foreground text-xs">مشتری</p>
                      <p className="font-medium">{selected.customerName}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground text-xs">وضعیت</p>
                    <Badge variant={statusBadgeVariant[selected.status]} className="mt-0.5">
                      {statusLabels[selected.status]}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">منبع</p>
                    <p className="font-medium">
                      {selected.source === "customer" ? "آنلاین" : "پیشخدمت"}
                    </p>
                  </div>
                </div>

                {selected.note && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">یادداشت</p>
                    <p>{selected.note}</p>
                  </div>
                )}

                <div className="border rounded-lg divide-y">
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-start p-3 gap-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.note && (
                          <p className="text-xs text-muted-foreground">{item.note}</p>
                        )}
                      </div>
                      <div className="text-end shrink-0">
                        <p>
                          {new Intl.NumberFormat("fa-IR").format(item.quantity)} ×{" "}
                          {formatToman(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t font-bold">
                  <span>جمع کل</span>
                  <span>{formatToman(selected.total)}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
