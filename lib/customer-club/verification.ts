import { createHmac, randomInt, timingSafeEqual } from "crypto";
import { connectDB } from "@/lib/db/mongoose";
import { CustomerVerification } from "@/lib/db/models/CustomerVerification";
import { CustomerClubMember } from "@/lib/db/models/CustomerClubMember";
import { sendCustomerOtp } from "@/lib/customer-club/sms";

const OTP_LENGTH = 6;
const OTP_EXPIRES_SECONDS = 120;
const MAX_ATTEMPTS = 3;
const VERIFICATION_TOKEN_TTL_MS = 15 * 60 * 1000;

function verificationIdentifier(cafeId: string, phone: string) {
  return `${cafeId}:${phone}`;
}

function generateOtpCode(): string {
  return String(randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, "0");
}

function getSigningSecret() {
  return process.env.BETTER_AUTH_SECRET!;
}

function signPayload(payload: string): string {
  return createHmac("sha256", getSigningSecret()).update(payload).digest("base64url");
}

export interface VerificationTokenPayload {
  phone: string;
  cafeId: string;
  isNewMember: boolean;
  discountPercent: number;
  exp: number;
}

export function createVerificationToken(payload: VerificationTokenPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(body);
  return `${body}.${signature}`;
}

export function parseVerificationToken(token: string): VerificationTokenPayload | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = signPayload(body);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    ) as VerificationTokenPayload;
    if (!payload.phone || !payload.cafeId || typeof payload.exp !== "number") return null;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function sendOtp(cafeId: string, phone: string): Promise<void> {
  await connectDB();

  const isProduction = process.env.NODE_ENV === "production";
  const masterOtp = process.env.MASTER_OTP;
  const code =
    !isProduction && masterOtp ? masterOtp : generateOtpCode();

  const identifier = verificationIdentifier(cafeId, phone);
  const expiresAt = new Date(Date.now() + OTP_EXPIRES_SECONDS * 1000);

  await CustomerVerification.findOneAndUpdate(
    { identifier },
    { code, attempts: 0, expiresAt },
    { upsert: true, new: true }
  );

  if (isProduction || !masterOtp) {
    await sendCustomerOtp(phone, code);
  }
}

export async function verifyOtp(
  cafeId: string,
  phone: string,
  code: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  await connectDB();

  const isProduction = process.env.NODE_ENV === "production";
  const masterOtp = process.env.MASTER_OTP;
  if (!isProduction && masterOtp && code === masterOtp) {
    return { ok: true };
  }

  const identifier = verificationIdentifier(cafeId, phone);
  const record = await CustomerVerification.findOne({ identifier });
  if (!record || record.expiresAt < new Date()) {
    return { ok: false, error: "کد منقضی شده است. دوباره درخواست دهید." };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return { ok: false, error: "تعداد تلاش بیش از حد مجاز است." };
  }

  if (record.code !== code) {
    record.attempts += 1;
    await record.save();
    return { ok: false, error: "کد تایید اشتباه است." };
  }

  await CustomerVerification.deleteOne({ identifier });
  return { ok: true };
}

export async function checkNewMember(cafeId: string, phone: string): Promise<boolean> {
  await connectDB();
  const existing = await CustomerClubMember.findOne({ cafeId, phoneNumber: phone }).lean();
  return !existing;
}

export async function registerMember(cafeId: string, phone: string): Promise<void> {
  await connectDB();
  await CustomerClubMember.findOneAndUpdate(
    { cafeId, phoneNumber: phone },
    { $setOnInsert: { joinedAt: new Date() } },
    { upsert: true }
  );
}

export function buildVerificationToken(
  phone: string,
  cafeId: string,
  isNewMember: boolean,
  discountPercent: number
): string {
  return createVerificationToken({
    phone,
    cafeId,
    isNewMember,
    discountPercent: isNewMember ? discountPercent : 0,
    exp: Date.now() + VERIFICATION_TOKEN_TTL_MS,
  });
}
