"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimeField } from "@/components/ui/time-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getMenuPublicUrl } from "@/lib/utils";
import { generateTableNumbers, getTableCount } from "@/lib/tables";
import { parseDigits, parseIntInput, toLatinDigits } from "@/lib/numerals";

const schema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  phone: z.preprocess(
    (val) => (typeof val === "string" ? parseDigits(val) : val),
    z.string().min(10)
  ),
  openTime: z.preprocess(
    (val) => (typeof val === "string" ? toLatinDigits(val) : val),
    z.string().regex(/^\d{2}:\d{2}$/)
  ),
  closeTime: z.preprocess(
    (val) => (typeof val === "string" ? toLatinDigits(val) : val),
    z.string().regex(/^\d{2}:\d{2}$/)
  ),
  fridayOpenTime: z.preprocess(
    (val) => (typeof val === "string" ? toLatinDigits(val) : val),
    z.string().regex(/^\d{2}:\d{2}$/)
  ),
  fridayCloseTime: z.preprocess(
    (val) => (typeof val === "string" ? toLatinDigits(val) : val),
    z.string().regex(/^\d{2}:\d{2}$/)
  ),
  tableCount: z.preprocess((val) => {
    if (typeof val === "number") return val;
    const n = parseIntInput(String(val ?? ""));
    return Number.isNaN(n) ? 0 : n;
  }, z.number().min(0).max(100)),
  customerClubDiscountEnabled: z.boolean(),
  newCustomerDiscountPercent: z.preprocess((val) => {
    if (typeof val === "number") return val;
    const n = parseIntInput(String(val ?? ""));
    return Number.isNaN(n) ? 0 : n;
  }, z.number().min(0).max(100)),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

interface Props {
  cafe: {
    name: string;
    address: string;
    city: string;
    phone: string;
    openTime: string;
    closeTime: string;
    fridayOpenTime?: string;
    fridayCloseTime?: string;
    slug: string;
    tableNumbers?: string[];
    customerClubDiscountEnabled?: boolean;
    newCustomerDiscountPercent?: number;
  };
}

export default function SettingsForm({ cafe }: Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: cafe.name,
      address: cafe.address,
      city: cafe.city,
      phone: cafe.phone,
      openTime: cafe.openTime,
      closeTime: cafe.closeTime,
      fridayOpenTime: cafe.fridayOpenTime ?? cafe.openTime,
      fridayCloseTime: cafe.fridayCloseTime ?? cafe.closeTime,
      tableCount: getTableCount(cafe.tableNumbers ?? []),
      customerClubDiscountEnabled: cafe.customerClubDiscountEnabled ?? false,
      newCustomerDiscountPercent: cafe.newCustomerDiscountPercent ?? 10,
    },
  });

  const clubEnabled = watch("customerClubDiscountEnabled");

  async function onSubmit(data: FormData) {
    const tableNumbers = generateTableNumbers(data.tableCount);
    const res = await fetch("/api/cafe", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        address: data.address,
        city: data.city,
        phone: data.phone,
        openTime: data.openTime,
        closeTime: data.closeTime,
        fridayOpenTime: data.fridayOpenTime,
        fridayCloseTime: data.fridayCloseTime,
        tableNumbers,
        customerClubDiscountEnabled: data.customerClubDiscountEnabled,
        newCustomerDiscountPercent: data.newCustomerDiscountPercent,
      }),
    });
    if (res.ok) {
      toast.success("تنظیمات ذخیره شد");
    } else {
      toast.error("خطا در ذخیره تنظیمات");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات عمومی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>نام کافه</Label>
            <Input {...register("name")} />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>آدرس منو (قابل تغییر نیست)</Label>
            <Input value={getMenuPublicUrl(cafe.slug)} disabled dir="ltr" />
            <p className="text-xs text-muted-foreground">
              برای چاپ QR کد به{" "}
              <Link href="/dashboard/qr" className="text-primary hover:underline">
                صفحه QR منو
              </Link>{" "}
              بروید.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>موقعیت و تماس</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>شهر</Label>
            <Input {...register("city")} />
          </div>
          <div className="space-y-2">
            <Label>آدرس</Label>
            <Input {...register("address")} />
          </div>
          <div className="space-y-2">
            <Label>شماره تلفن</Label>
            <Input type="tel" {...register("phone")} dir="ltr" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ساعات کاری</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium">شنبه تا پنجشنبه</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ساعت باز شدن</Label>
                <Controller
                  control={control}
                  name="openTime"
                  render={({ field }) => (
                    <TimeField value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>ساعت بسته شدن</Label>
                <Controller
                  control={control}
                  name="closeTime"
                  render={({ field }) => (
                    <TimeField value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} />
                  )}
                />
              </div>
            </div>
          </div>
          <div className="space-y-3 border-t pt-4">
            <p className="text-sm font-medium">جمعه</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ساعت باز شدن</Label>
                <Controller
                  control={control}
                  name="fridayOpenTime"
                  render={({ field }) => (
                    <TimeField value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>ساعت بسته شدن</Label>
                <Controller
                  control={control}
                  name="fridayCloseTime"
                  render={({ field }) => (
                    <TimeField value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} />
                  )}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>میزها</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>تعداد میزها</Label>
          <Input
            type="number"
            min={0}
            max={100}
            dir="ltr"
            placeholder="مثال: ۱۰"
            {...register("tableCount")}
          />
          {errors.tableCount && (
            <p className="text-destructive text-xs">{errors.tableCount.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            میزها از ۱ تا تعداد واردشده شماره‌گذاری می‌شوند. ۰ یعنی بدون میز.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>باشگاه مشتریان</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              {...register("customerClubDiscountEnabled")}
            />
            <div>
              <p className="text-sm font-medium">تخفیف اولین سفارش با تایید شماره</p>
              <p className="text-xs text-muted-foreground">
                مشتری در سبد خرید شماره موبایل را تایید می‌کند. اگر شماره برای اولین
                بار باشد، تخفیف اعمال می‌شود.
              </p>
            </div>
          </label>
          {clubEnabled && (
            <div className="space-y-2">
              <Label>درصد تخفیف مشتری جدید</Label>
              <Input
                type="number"
                min={0}
                max={100}
                dir="ltr"
                {...register("newCustomerDiscountPercent")}
              />
              {errors.newCustomerDiscountPercent && (
                <p className="text-destructive text-xs">
                  {errors.newCustomerDiscountPercent.message}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </Button>
    </form>
  );
}
