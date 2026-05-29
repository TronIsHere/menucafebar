"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, AlertTriangle, Package } from "@/lib/icons/app-icons";
import { parseIntInput } from "@/lib/numerals";
import {
  formatPriceInput,
  parsePriceInput,
} from "@/lib/prices/format";

interface InventoryItem {
  _id: string;
  name: string;
  unit: string;
  quantity: number;
  lowThreshold: number;
  cost?: number;
}

interface Customer {
  name: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string;
}

interface Props {
  inventoryItems: InventoryItem[];
  customers: Customer[];
}

function formatToman(n: number) {
  return new Intl.NumberFormat("fa-IR").format(n) + " تومان";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fa-IR");
}

const UNITS = ["عدد", "کیلوگرم", "گرم", "لیتر", "میلی‌لیتر", "بسته", "جعبه"];

export default function CRMDashboard({ inventoryItems: initial, customers }: Props) {
  const [items, setItems] = useState<InventoryItem[]>(initial);
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState({
    name: "",
    unit: "عدد",
    quantity: "",
    lowThreshold: "5",
    cost: "",
  });
  const [loading, setLoading] = useState(false);

  const lowStockItems = items.filter((i) => i.quantity <= i.lowThreshold);

  function openNew() {
    setEditing(null);
    setForm({ name: "", unit: "عدد", quantity: "", lowThreshold: "5", cost: "" });
    setDialog(true);
  }

  function openEdit(item: InventoryItem) {
    setEditing(item);
    setForm({
      name: item.name,
      unit: item.unit,
      quantity: item.quantity.toString(),
      lowThreshold: item.lowThreshold.toString(),
      cost: item.cost != null ? formatPriceInput(item.cost) : "",
    });
    setDialog(true);
  }

  async function save() {
    if (!form.name.trim()) {
      toast.error("نام را وارد کنید");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        unit: form.unit,
        quantity: parseIntInput(form.quantity) || 0,
        lowThreshold: parseIntInput(form.lowThreshold) || 5,
        cost: form.cost ? parsePriceInput(form.cost) : undefined,
      };

      if (editing) {
        const res = await fetch(`/api/inventory/${editing._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        setItems((prev) =>
          prev.map((i) => (i._id === editing._id ? { ...i, ...payload } : i))
        );
        toast.success("آیتم انبار ویرایش شد");
      } else {
        const res = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const { item } = await res.json();
        setItems((prev) => [...prev, item]);
        toast.success("آیتم به انبار اضافه شد");
      }
      setDialog(false);
    } catch {
      toast.error("خطا در ذخیره");
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id: string) {
    const res = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success("آیتم حذف شد");
    } else {
      toast.error("خطا در حذف");
    }
  }

  async function updateQuantity(item: InventoryItem, delta: number) {
    const newQty = Math.max(0, item.quantity + delta);
    const res = await fetch(`/api/inventory/${item._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQty }),
    });
    if (res.ok) {
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, quantity: newQty } : i))
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Low stock alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-orange-800">هشدار موجودی کم</p>
              <p className="text-sm text-orange-700 mt-1">
                {lowStockItems.map((i) => i.name).join("، ")}: موجودی کمتر از حد مجاز
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="inventory">
        <TabsList className="w-full h-auto flex-wrap sm:flex-nowrap justify-start gap-1">
          <TabsTrigger value="inventory" className="flex-1 sm:flex-none">مدیریت انبار</TabsTrigger>
          <TabsTrigger value="customers" className="flex-1 sm:flex-none">مشتریان</TabsTrigger>
        </TabsList>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="pt-4">
          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-5 h-5" />
                موجودی انبار
              </CardTitle>
              <Button size="sm" onClick={openNew} className="gap-1 w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                افزودن آیتم
              </Button>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">
                  آیتمی در انبار ثبت نشده است
                </p>
              ) : (
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <Table className="min-w-[540px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>نام</TableHead>
                      <TableHead>موجودی</TableHead>
                      <TableHead>واحد</TableHead>
                      <TableHead>حد هشدار</TableHead>
                      <TableHead>وضعیت</TableHead>
                      <TableHead className="text-end">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item, -1)}
                              className="w-6 h-6 rounded bg-muted text-sm flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="w-10 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item, 1)}
                              className="w-6 h-6 rounded bg-muted text-sm flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.lowThreshold}</TableCell>
                        <TableCell>
                          {item.quantity <= item.lowThreshold ? (
                            <Badge variant="destructive" className="text-xs">
                              کم
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-xs text-green-700 border-green-300"
                            >
                              کافی
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEdit(item)}
                              className="h-7 w-7 p-0"
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteItem(item._id)}
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">تاریخچه مشتریان</CardTitle>
            </CardHeader>
            <CardContent>
              {customers.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">
                  هنوز مشتری با نام ثبت نشده است
                </p>
              ) : (
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <Table className="min-w-[480px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>نام</TableHead>
                      <TableHead>تعداد سفارش</TableHead>
                      <TableHead>مجموع خرید</TableHead>
                      <TableHead>آخرین سفارش</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers
                      .sort((a, b) => b.totalSpent - a.totalSpent)
                      .map((customer) => (
                        <TableRow key={customer.name}>
                          <TableCell className="font-medium">
                            {customer.name}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("fa-IR").format(
                              customer.orderCount
                            )}
                          </TableCell>
                          <TableCell>
                            {formatToman(customer.totalSpent)}
                          </TableCell>
                          <TableCell>
                            {formatDate(customer.lastOrder)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Inventory Dialog */}
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {editing ? "ویرایش آیتم انبار" : "آیتم جدید"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>نام *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="قهوه اسپرسو"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>موجودی *</Label>
                <Input
                  type="number"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quantity: e.target.value }))
                  }
                  placeholder="100"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1">
                <Label>واحد</Label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                  className="w-full h-10 border border-input rounded-md px-3 text-sm bg-background"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>حد هشدار</Label>
                <Input
                  type="number"
                  value={form.lowThreshold}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, lowThreshold: e.target.value }))
                  }
                  placeholder="5"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1">
                <Label>قیمت خرید (تومان)</Label>
                <Input
                  type="number"
                  value={form.cost}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      cost: formatPriceInput(e.target.value),
                    }))
                  }
                  placeholder="اختیاری"
                  dir="ltr"
                  className="text-left tabular-nums"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDialog(false)}
              >
                لغو
              </Button>
              <Button className="flex-1" onClick={save} disabled={loading}>
                {loading ? "در حال ذخیره..." : "ذخیره"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
