"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import TableCartLabel from "@/components/menu/TableCartLabel";
import CustomerClubVerify, {
  CustomerClubDiscountSummary,
  type CustomerClubState,
} from "@/components/checkout/CustomerClubVerify";
import { calculateDiscount } from "@/lib/customer-club/discount";
import { toast } from "sonner";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface Cafe {
  name: string;
  slug: string;
  tableNumbers?: string[];
  customerClubDiscountEnabled?: boolean;
  newCustomerDiscountPercent?: number;
}

function formatToman(n: number) {
  return new Intl.NumberFormat("fa-IR").format(n) + " تومان";
}

export default function CheckoutClient({ cafe }: { cafe: Cafe }) {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, total, tableNumber: cartTableNumber } =
    useCartStore();
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [clubState, setClubState] = useState<CustomerClubState | null>(null);

  const hasDefinedTables = (cafe.tableNumbers ?? []).length > 0;
  const clubEnabled = cafe.customerClubDiscountEnabled ?? false;
  const discountPercentSetting = cafe.newCustomerDiscountPercent ?? 10;
  const subtotal = total();
  const appliedDiscountPercent =
    clubState?.isNewMember && clubState.discountPercent > 0
      ? clubState.discountPercent
      : 0;
  const pricing = calculateDiscount(subtotal, appliedDiscountPercent);
  const cartTotal = pricing.total;
  const tableFromQr = Boolean(cartTableNumber);

  async function submitOrder() {
    if (items.length === 0) {
      toast.error("سبد خالی است");
      return;
    }
    if (hasDefinedTables && !cartTableNumber) {
      toast.error("میز را انتخاب کنید");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cafeSlug: cafe.slug,
          source: "customer",
          tableNumber: cartTableNumber || undefined,
          customerName,
          note,
          verificationToken: clubState?.verificationToken,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            note: i.note,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "خطا در ثبت سفارش");
        return;
      }
      clearCart();
      router.push(`/${cafe.slug}/order/${data.order._id}`);
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center space-y-4">
          <p className="text-gray-500">سبد شما خالی است</p>
          <Link href={`/${cafe.slug}`}>
            <Button variant="outline">بازگشت به منو</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Link href={`/${cafe.slug}`} className="text-gray-600">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-lg">تایید سفارش</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4 space-y-4 pb-32">
        {tableFromQr && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <TableCartLabel
                tableNumber={cartTableNumber}
                className="text-sm font-medium text-primary text-center"
              />
            </CardContent>
          </Card>
        )}

        {/* Order items */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">آیتم‌های سفارش</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((item) => (
              <div key={item.menuItemId} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl shrink-0">
                    🍽️
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatToman(item.price)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center font-bold text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeItem(item.menuItemId)}
                    className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            <Separator />
            {appliedDiscountPercent > 0 ? (
              <CustomerClubDiscountSummary
                subtotal={subtotal}
                discountPercent={appliedDiscountPercent}
              />
            ) : (
              <div className="flex justify-between font-bold">
                <span>جمع کل:</span>
                <span>{formatToman(cartTotal)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {clubEnabled && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">باشگاه مشتریان</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerClubVerify
                cafeSlug={cafe.slug}
                discountPercentSetting={discountPercentSetting}
                onVerified={setClubState}
                onReset={() => setClubState(null)}
              />
            </CardContent>
          </Card>
        )}

        {/* Customer info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">اطلاعات سفارش</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label>نام شما (اختیاری)</Label>
              <Input
                placeholder="مثال: علی"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>یادداشت (اختیاری)</Label>
              <Input
                placeholder="توضیح خاص برای سفارش..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment notice */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800">
              💳 پرداخت هنگام تحویل سفارش انجام می‌شود
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Submit button */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t p-4">
        <div className="max-w-lg mx-auto">
          <Button
            className="w-full h-12 text-base"
            onClick={submitOrder}
            disabled={loading}
          >
            {loading ? "در حال ثبت..." : `ثبت سفارش (${formatToman(cartTotal)})`}
          </Button>
        </div>
      </div>
    </div>
  );
}
