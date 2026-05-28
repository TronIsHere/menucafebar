import { isKavenegarConfigured, sendOtpSms } from "@/lib/kavenegar";

const isProduction = process.env.NODE_ENV === "production";

export async function sendCustomerOtp(
  phone: string,
  code: string
): Promise<void> {
  if (!isProduction || !isKavenegarConfigured()) {
    console.log(`[Customer Club OTP] Send ${code} to ${phone}`);
  }

  if (!isKavenegarConfigured()) return;

  await sendOtpSms(phone, code);
}
