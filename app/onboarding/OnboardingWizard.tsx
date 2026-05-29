"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { parseDigits, toLatinDigits } from "@/lib/numerals";

const schema = z.object({
  name: z.string().min(2, "نام کافه باید حداقل ۲ کاراکتر باشد"),
  address: z.string().min(5, "آدرس باید حداقل ۵ کاراکتر باشد"),
  city: z.string().min(2, "شهر را وارد کنید"),
  phone: z.preprocess(
    (val) => (typeof val === "string" ? parseDigits(val) : val),
    z.string().min(10, "شماره تلفن معتبر وارد کنید")
  ),
  openTime: z.preprocess(
    (val) => (typeof val === "string" ? toLatinDigits(val) : val),
    z.string().regex(/^\d{2}:\d{2}$/, "فرمت اشتباه")
  ),
  closeTime: z.preprocess(
    (val) => (typeof val === "string" ? toLatinDigits(val) : val),
    z.string().regex(/^\d{2}:\d{2}$/, "فرمت اشتباه")
  ),
  slug: z
    .string()
    .min(3, "حداقل ۳ کاراکتر")
    .regex(/^[a-z0-9-]+$/, "فقط حروف انگلیسی کوچک، اعداد و خط تیره"),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

const STEPS = [
  { title: "اطلاعات کافه", description: "نام و شناسه کافه خود را وارد کنید" },
  { title: "موقعیت و تماس", description: "آدرس و شماره تماس کافه" },
  { title: "ساعات کاری", description: "ساعت باز و بسته بودن کافه" },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .slice(0, 40);
}

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      openTime: "08:00",
      closeTime: "22:00",
    },
  });

  const cafeName = watch("name");

  async function nextStep() {
    let valid = false;
    if (step === 0) valid = await trigger(["name", "slug"]);
    if (step === 1) valid = await trigger(["address", "city", "phone"]);
    if (step === 2) valid = await trigger(["openTime", "closeTime"]);
    if (valid) setStep((s) => s + 1);
  }

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/cafe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "خطا در ثبت اطلاعات");
        return;
      }
      toast.success("کافه با موفقیت ثبت شد!");
      router.push("/dashboard");
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold mb-4">
            ☕
          </div>
          <h1 className="text-2xl font-bold">راه‌اندازی کافه</h1>
          <p className="text-muted-foreground text-sm mt-1">
            مرحله {step + 1} از {STEPS.length}
          </p>
        </div>

        <Progress value={((step + 1) / STEPS.length) * 100} className="mb-6 h-2" />

        <Card>
          <CardHeader>
            <CardTitle>{STEPS[step].title}</CardTitle>
            <CardDescription>{STEPS[step].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {step === 0 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">نام کافه *</Label>
                    <Input
                      id="name"
                      placeholder="کافه برگ سبز"
                      {...register("name", {
                        onChange: (e) => {
                          const val = e.target.value;
                          if (val) setValue("slug", slugify(val));
                        },
                      })}
                    />
                    {errors.name && (
                      <p className="text-destructive text-xs">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">شناسه کافه (برای آدرس منو) *</Label>
                    <div className="flex items-center gap-2 border rounded-md px-3">
                      <span className="text-muted-foreground text-sm">menucafe.ir/</span>
                      <input
                        id="slug"
                        className="flex-1 py-2 bg-transparent text-sm outline-none"
                        placeholder="cafe-name"
                        dir="ltr"
                        {...register("slug")}
                      />
                    </div>
                    {errors.slug && (
                      <p className="text-destructive text-xs">{errors.slug.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      مشتریان با این آدرس به منوی شما دسترسی خواهند داشت
                    </p>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="city">شهر *</Label>
                    <Input id="city" placeholder="تهران" {...register("city")} />
                    {errors.city && (
                      <p className="text-destructive text-xs">{errors.city.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">آدرس *</Label>
                    <Input
                      id="address"
                      placeholder="خیابان ولیعصر، پلاک ۱۲"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="text-destructive text-xs">{errors.address.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">شماره تلفن *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="02112345678"
                      dir="ltr"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-destructive text-xs">{errors.phone.message}</p>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="openTime">ساعت باز شدن *</Label>
                      <Input
                        id="openTime"
                        type="time"
                        dir="ltr"
                        {...register("openTime")}
                      />
                      {errors.openTime && (
                        <p className="text-destructive text-xs">{errors.openTime.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="closeTime">ساعت بسته شدن *</Label>
                      <Input
                        id="closeTime"
                        type="time"
                        dir="ltr"
                        {...register("closeTime")}
                      />
                      {errors.closeTime && (
                        <p className="text-destructive text-xs">{errors.closeTime.message}</p>
                      )}
                    </div>
                  </div>
                  {cafeName && (
                    <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
                      <p className="font-medium">خلاصه اطلاعات:</p>
                      <p className="text-muted-foreground">نام: {cafeName}</p>
                      <p className="text-muted-foreground">
                        آدرس منو: menucafe.ir/{watch("slug")}
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-3 pt-2">
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep((s) => s - 1)}
                    className="flex-1"
                  >
                    قبلی
                  </Button>
                )}
                {step < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1"
                  >
                    بعدی
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "در حال ثبت..." : "تکمیل ثبت‌نام"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
