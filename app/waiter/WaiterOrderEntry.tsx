"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import TablePicker from "@/components/tables/TablePicker";
import { Minus, Plus, ShoppingCart, Trash2, Send } from "@/lib/icons/app-icons";
import { CategoryIcon } from "@/components/icons/CategoryIcon";

interface Category {
  _id: string;
  name: string;
  icon?: string;
}

interface MenuItem {
  _id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
}

interface CartItem extends MenuItem {
  quantity: number;
  note: string;
}

interface Props {
  cafeSlug: string;
  categories: Category[];
  items: MenuItem[];
  tableNumbers: string[];
}

function formatToman(n: number) {
  return new Intl.NumberFormat("fa-IR").format(n) + " تومان";
}

export default function WaiterOrderEntry({ categories, items, tableNumbers }: Props) {
  const [activeCatId, setActiveCatId] = useState(categories[0]?._id ?? "");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState("");
  const [occupiedTables, setOccupiedTables] = useState<string[]>([]);
  const [orderNote, setOrderNote] = useState("");
  const [loading, setLoading] = useState(false);

  const hasDefinedTables = tableNumbers.length > 0;
  const catItems = items.filter((i) => i.categoryId === activeCatId);
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const fetchTableStatus = useCallback(async () => {
    if (!hasDefinedTables) return;
    try {
      const res = await fetch("/api/tables");
      if (!res.ok) return;
      const data = await res.json();
      setOccupiedTables(data.occupied ?? []);
    } catch {}
  }, [hasDefinedTables]);

  useEffect(() => {
    fetchTableStatus();
  }, [fetchTableStatus]);

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((c) => c._id === item._id);
      if (existing) {
        return prev.map((c) =>
          c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1, note: "" }];
    });
  }

  function removeFromCart(itemId: string) {
    setCart((prev) => prev.filter((c) => c._id !== itemId));
  }

  function changeQuantity(itemId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((c) => (c._id === itemId ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  }

  function updateNote(itemId: string, note: string) {
    setCart((prev) =>
      prev.map((c) => (c._id === itemId ? { ...c, note } : c))
    );
  }

  async function submitOrder() {
    if (cart.length === 0) {
      toast.error("سبد خالی است");
      return;
    }
    if (hasDefinedTables && !tableNumber) {
      toast.error("میز را انتخاب کنید");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "waiter",
          tableNumber: tableNumber || undefined,
          note: orderNote,
          items: cart.map((c) => ({
            menuItemId: c._id,
            name: c.name,
            price: c.price,
            quantity: c.quantity,
            note: c.note || undefined,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "خطا در ثبت سفارش");
        return;
      }
      toast.success("سفارش ثبت شد");
      setCart([]);
      setTableNumber("");
      setOrderNote("");
      await fetchTableStatus();
    } catch {
      toast.error("خطا در ثبت سفارش");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Menu Panel */}
      <div className="md:col-span-3 space-y-3">
        {/* Category tabs */}
        <div className="w-full overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCatId(cat._id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCatId === cat._id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:bg-muted"
                }`}
              >
                <CategoryIcon icon={cat.icon} size={14} className="me-1 inline-block" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="grid grid-cols-2 gap-3">
          {catItems.map((item) => {
            const inCart = cart.find((c) => c._id === item._id);
            return (
              <Card
                key={item._id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  inCart ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => addToCart(item)}
              >
                <CardContent className="p-3">
                  <div className="w-full h-16 rounded-md bg-muted flex items-center justify-center text-2xl mb-2">
                    🍽️
                  </div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-primary font-bold mt-1">
                    {formatToman(item.price)}
                  </p>
                  {inCart && (
                    <Badge className="mt-1 text-xs">{inCart.quantity}×</Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {catItems.length === 0 && (
            <p className="col-span-2 text-center text-muted-foreground py-8">
              آیتمی در این دسته‌بندی موجود نیست
            </p>
          )}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="md:col-span-2">
        <Card className="sticky top-20">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <h2 className="font-semibold">سبد سفارش</h2>
              {cart.length > 0 && (
                <Badge variant="secondary">{cart.length}</Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label>شماره میز</Label>
              {hasDefinedTables ? (
                <>
                  <TablePicker
                    tableNumbers={tableNumbers}
                    occupied={occupiedTables}
                    selected={tableNumber}
                    onSelect={setTableNumber}
                  />
                  <p className="text-xs text-muted-foreground">
                    میزهای خاکستری اشغال هستند
                  </p>
                </>
              ) : (
                <Input
                  placeholder="مثال: ۳"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                />
              )}
            </div>

            {cart.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">
                آیتمی انتخاب نشده است
              </p>
            ) : (
              <ScrollArea className="max-h-64">
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item._id} className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <span className="text-sm truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => changeQuantity(item._id, -1)}
                            className="w-6 h-6 rounded-full bg-muted flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => changeQuantity(item._id, 1)}
                            className="w-6 h-6 rounded-full bg-muted flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <Input
                        placeholder="یادداشت (اختیاری)"
                        value={item.note}
                        onChange={(e) => updateNote(item._id, e.target.value)}
                        className="h-7 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {cart.length > 0 && (
              <>
                <div className="space-y-2">
                  <Label>یادداشت سفارش</Label>
                  <Input
                    placeholder="یادداشت کلی..."
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between font-bold">
                  <span>جمع کل:</span>
                  <span>{formatToman(total)}</span>
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={submitOrder}
                  disabled={loading}
                >
                  <Send className="w-4 h-4" />
                  {loading ? "در حال ثبت..." : "ثبت سفارش"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
