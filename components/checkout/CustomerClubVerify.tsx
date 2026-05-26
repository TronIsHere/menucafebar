"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { formatPhone } from "@/lib/customer-club/phone";
import { Gift, Phone } from "lucide-react";

type Step = "phone" | "otp" | "verified";

export interface CustomerClubState {
  phone: string;
  isNewMember: boolean;
  discountPercent: number;
  verificationToken: string;
}

interface Props {
  cafeSlug: string;
  discountPercentSetting: number;
  onVerified: (state: CustomerClubState) => void;
  onReset: () => void;
}

function formatToman(n: number) {
  return new Intl.NumberFormat("fa-IR").format(n) + " تومان";
}

export default function CustomerClubVerify({
  cafeSlug,
  discountPercentSetting,
  onVerified,
  onReset,
}: Props) {
  const [step, setStep] = useState<Step>("phone");
  const [phoneInput, setPhoneInput] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifiedState, setVerifiedState] = useState<CustomerClubState | null>(null);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    const formattedPhone = formatPhone(phoneInput);
    if (!formattedPhone || formattedPhone.length < 10) {
      toast.error("شماره موبایل معتبر وارد کنید");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/customer-club/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cafeSlug, phone: formattedPhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "خطا در ارسال کد");
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

  async function handleVerifyOtp(code?: string) {
    const otpCode = code ?? otp;
    if (otpCode.length !== 6) {
      toast.error("کد ۶ رقمی را وارد کنید");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/customer-club/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cafeSlug, phone, code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "کد تایید اشتباه است");
        setOtp("");
        return;
      }

      const state: CustomerClubState = {
        phone: data.phone,
        isNewMember: data.isNewMember,
        discountPercent: data.discountPercent,
        verificationToken: data.verificationToken,
      };
      setVerifiedState(state);
      setStep("verified");
      onVerified(state);
      toast.success(
        data.isNewMember
          ? `تبریک! ${data.discountPercent}٪ تخفیف اولین سفارش برای شما فعال شد`
          : "شماره شما تایید شد"
      );
    } catch {
      toast.error("خطا در تایید کد");
    } finally {
      setLoading(false);
    }
  }

  function handleChangePhone() {
    setStep("phone");
    setOtp("");
    setVerifiedState(null);
    onReset();
  }

  if (step === "verified" && verifiedState) {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 rounded-lg bg-green-50 border border-green-200 p-3">
          <Phone className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-green-900">شماره تایید شد</p>
            <p className="text-xs text-green-700 mt-0.5" dir="ltr">
              {verifiedState.phone}
            </p>
          </div>
        </div>
        {verifiedState.isNewMember && verifiedState.discountPercent > 0 && (
          <div className="flex items-start gap-3 rounded-lg bg-emerald-50 border border-emerald-200 p-3">
            <Gift className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-emerald-900">
                {verifiedState.discountPercent}٪ تخفیف اولین سفارش
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                این تخفیف فقط برای اولین سفارش با این شماره اعمال می‌شود
              </p>
            </div>
          </div>
        )}
        <Button
          type="button"
          variant="ghost"
          className="w-full text-sm"
          onClick={handleChangePhone}
        >
          تغییر شماره موبایل
        </Button>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          کد ۶ رقمی ارسال‌شده به{" "}
          <span dir="ltr" className="font-medium text-foreground">
            {phone}
          </span>{" "}
          را وارد کنید
        </p>
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
          type="button"
          className="w-full"
          disabled={loading || otp.length !== 6}
          onClick={() => handleVerifyOtp()}
        >
          {loading ? "در حال بررسی..." : "تایید شماره"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full text-sm"
          onClick={handleChangePhone}
          disabled={loading}
        >
          تغییر شماره موبایل
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSendOtp} className="space-y-4">
      <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
        <p className="text-sm text-primary/90">
          با تایید شماره موبایل، عضو باشگاه مشتریان می‌شوید.
          {discountPercentSetting > 0 && (
            <> مشتریان جدید {discountPercentSetting}٪ تخفیف در اولین سفارش دریافت می‌کنند.</>
          )}
        </p>
      </div>
      <div className="space-y-1">
        <Label>شماره موبایل</Label>
        <Input
          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          dir="ltr"
          inputMode="tel"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "در حال ارسال..." : "ارسال کد تایید"}
      </Button>
    </form>
  );
}

export function CustomerClubDiscountSummary({
  subtotal,
  discountPercent,
}: {
  subtotal: number;
  discountPercent: number;
}) {
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount);

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>جمع آیتم‌ها:</span>
        <span>{formatToman(subtotal)}</span>
      </div>
      <div className="flex justify-between text-emerald-600">
        <span>تخفیف باشگاه ({discountPercent}٪):</span>
        <span>−{formatToman(discountAmount)}</span>
      </div>
      <div className="flex justify-between font-bold text-base pt-1">
        <span>جمع کل:</span>
        <span>{formatToman(total)}</span>
      </div>
    </div>
  );
}
