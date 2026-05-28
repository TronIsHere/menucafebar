"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { AppLogo } from "@/components/brand/AppLogo";

type Step = "phone" | "otp";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  function formatPhone(value: string) {
    // Keep only digits and leading +
    const cleaned = value.replace(/[^\d+]/g, "");
    // Auto-prepend +98 for Iranian numbers starting with 0
    if (cleaned.startsWith("0") && cleaned.length > 1) {
      return "+98" + cleaned.slice(1);
    }
    return cleaned;
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    const formattedPhone = formatPhone(phone);
    if (!formattedPhone || formattedPhone.length < 10) {
      toast.error("شماره موبایل معتبر وارد کنید");
      return;
    }
    setLoading(true);
    try {
      const { error } = await authClient.phoneNumber.sendOtp({
        phoneNumber: formattedPhone,
      });
      if (error) {
        toast.error(error.message || "خطا در ارسال کد");
        return;
      }
      setPhone(formattedPhone);
      setStep("otp");
      toast.success("کد تایید ارسال شد");
    } catch {
      toast.error("خطا در ارسال کد تایید");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (otp.length !== 6) {
      toast.error("کد ۶ رقمی را وارد کنید");
      return;
    }
    setLoading(true);
    try {
      const { error } = await authClient.phoneNumber.verify({
        phoneNumber: phone,
        code: otp,
      });
      if (error) {
        toast.error("کد اشتباه است");
        setOtp("");
        return;
      }
      toast.success("ورود موفق");
      router.push(redirect);
      router.refresh();
    } catch {
      toast.error("خطا در تایید کد");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <AppLogo size="lg" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">{APP_NAME}</h1>
          <p className="text-muted-foreground text-sm mt-1">{APP_TAGLINE}</p>
        </div>

        <Card>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">
              {step === "phone" ? "ورود / ثبت‌نام" : "تایید شماره موبایل"}
            </CardTitle>
            <CardDescription>
              {step === "phone" ? (
                "شماره موبایل خود را وارد کنید"
              ) : (
                <>
                  کد ارسال شده به{" "}
                  <span dir="ltr" className="inline-block">
                    {phone}
                  </span>{" "}
                  را وارد کنید
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {step === "phone" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">شماره موبایل</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="09123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    className="text-center tracking-widest text-lg"
                    autoFocus
                    required
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    اگر قبلاً ثبت‌نام نکرده‌اید، حساب جدید ایجاد می‌شود
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "در حال ارسال..." : "ارسال کد تایید"}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    onComplete={handleVerifyOtp}
                    dir="ltr"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button
                  onClick={handleVerifyOtp}
                  className="w-full"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? "در حال بررسی..." : "تایید و ورود"}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-sm"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                  }}
                  disabled={loading}
                >
                  تغییر شماره موبایل
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted-foreground">در حال بارگذاری...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
