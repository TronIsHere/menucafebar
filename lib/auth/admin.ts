import { MongoClient, ObjectId } from "mongodb";
import { formatPhone } from "@/lib/customer-club/phone";

const client = new MongoClient(process.env.MONGODB_URI!);

/** Digits-only Iranian mobile (10 digits after country/leading zero). */
function mobileDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("98") && digits.length >= 12) return digits.slice(-10);
  if (digits.startsWith("0") && digits.length >= 11) return digits.slice(1);
  return digits.slice(-10);
}

/** Platform admin phone numbers — matched flexibly (0930..., +98..., etc.) */
const ADMIN_MOBILE_DIGITS = new Set([mobileDigits("09306613683")]);

export function isAdminPhone(phone: string | undefined | null): boolean {
  if (!phone) return false;
  try {
    const key = mobileDigits(formatPhone(phone));
    return ADMIN_MOBILE_DIGITS.has(key);
  } catch {
    const key = mobileDigits(phone);
    return ADMIN_MOBILE_DIGITS.has(key);
  }
}

export function isAdminRole(role: string | undefined | null): boolean {
  return role === "admin";
}

function userIdFilter(userId: string): Record<string, unknown> {
  if (ObjectId.isValid(userId)) {
    return { _id: new ObjectId(userId) };
  }
  return { _id: userId };
}

export async function getUserById(userId: string) {
  const db = client.db();
  return db.collection("user").findOne(userIdFilter(userId));
}

export async function getUserPhone(userId: string): Promise<string | null> {
  const user = await getUserById(userId);
  if (!user) return null;
  return (user.phoneNumber as string | undefined) ?? null;
}

export async function ensureAdminRole(userId: string): Promise<boolean> {
  const phone = await getUserPhone(userId);
  if (!isAdminPhone(phone)) return false;

  const db = client.db();
  await db
    .collection("user")
    .updateOne(userIdFilter(userId), { $set: { role: "admin" } });
  return true;
}

export async function resolveUserRole(
  userId: string,
  currentRole?: string | null,
  phoneHint?: string | null
): Promise<"admin" | "owner"> {
  if (currentRole === "admin") return "admin";

  const phone = phoneHint ?? (await getUserPhone(userId));
  if (isAdminPhone(phone)) {
    await ensureAdminRole(userId);
    return "admin";
  }

  return "owner";
}
