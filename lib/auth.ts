import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { phoneNumber } from "better-auth/plugins";
import type { GenericEndpointContext } from "@better-auth/core";
import { MongoClient } from "mongodb";
import { isKavenegarConfigured, sendOtpSms } from "@/lib/kavenegar";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

const isProduction = process.env.NODE_ENV === "production";
const masterOtp = process.env.MASTER_OTP;

function createMasterOtpVerify(allowedAttempts = 3) {
  return async (
    { phoneNumber: phone, code }: { phoneNumber: string; code: string },
    ctx?: GenericEndpointContext
  ) => {
    if (masterOtp && code === masterOtp) {
      return true;
    }

    if (!ctx) return false;

    const adapter = ctx.context.internalAdapter;
    const otp = await adapter.findVerificationValue(phone);
    if (!otp || otp.expiresAt < new Date()) return false;

    const [otpValue, attempts] = otp.value.split(":");
    if (attempts && parseInt(attempts, 10) >= allowedAttempts) return false;

    if (otpValue !== code) {
      await adapter.updateVerificationByIdentifier(phone, {
        value: `${otpValue}:${parseInt(attempts || "0", 10) + 1}`,
      });
      return false;
    }

    return true;
  };
}

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Disable transactions for standalone MongoDB (no replica set)
    // Enable if you run MongoDB Atlas or a replica set
    transaction: false,
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber: phone, code }) => {
        if (!isProduction || !isKavenegarConfigured()) {
          console.log(`[SMS OTP] Send ${code} to ${phone}`);
        }

        if (!isKavenegarConfigured()) return;

        await sendOtpSms(phone, code);
      },
      signUpOnVerification: {
        getTempEmail: (phone) => `${phone.replace(/\D/g, "")}@menucaffe.ir`,
        getTempName: (phone) => phone,
      },
      requireVerification: true,
      expiresIn: 120,
      otpLength: 6,
      allowedAttempts: 3,
      ...(masterOtp ? { verifyOTP: createMasterOtpVerify(3) } : {}),
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "owner",
        input: false,
      },
      cafeId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
