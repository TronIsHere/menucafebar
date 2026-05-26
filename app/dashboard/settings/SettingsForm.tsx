"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getMenuPublicUrl } from "@/lib/utils";
import { generateTableNumbers, getTableCount } from "@/lib/tables";

const schema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  phone: z.string().min(10),
  openTime: z.string().regex(/^\d{2}:\d{2}$/),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/),
  tableCount: z.number().min(0).max(100),
  customerClubDiscountEnabled: z.boolean(),
  newCustomerDiscountPercent: z.number().min(0).max(100),
});

type FormData = z.infer<typeof schema>;

interface Props {
  cafe: {
    name: string;
    address: string;
    city: string;
    phone: string;
    openTime: string;
    closeTime: string;
    slug: string;
    tableNumbers?: string[];
    customerClubDiscountEnabled?: boolean;
    newCustomerDiscountPercent?: number;
  };
}

export default function SettingsForm({ cafe }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: cafe.name,
      address: cafe.address,
      city: cafe.city,
      phone: cafe.phone,
      openTime: cafe.openTime,
      closeTime: cafe.closeTime,
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
            <Input {...register("phone")} dir="ltr" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ساعات کاری</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ساعت باز شدن</Label>
              <Input type="time" {...register("openTime")} dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>ساعت بسته شدن</Label>
              <Input type="time" {...register("closeTime")} dir="ltr" />
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
            {...register("tableCount", { valueAsNumber: true })}
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
                {...register("newCustomerDiscountPercent", { valueAsNumber: true })}
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
