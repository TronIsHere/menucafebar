import { headers } from "next/headers";
import { auth } from "./auth";
import { connectDB } from "./db/mongoose";
import { Cafe } from "./db/models/Cafe";
import { getUserPhone, isAdminRole, resolveUserRole } from "./auth/admin";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export type EnrichedSession = NonNullable<Awaited<ReturnType<typeof getSession>>> & {
  user: NonNullable<Awaited<ReturnType<typeof getSession>>>["user"] & {
    role: "admin" | "owner";
    phoneNumber?: string | null;
  };
};

export async function getEnrichedSession(): Promise<EnrichedSession | null> {
  const session = await getSession();
  if (!session) return null;

  const sessionUser = session.user as { role?: string; phoneNumber?: string };
  const phone =
    sessionUser.phoneNumber ?? (await getUserPhone(session.user.id));
  const role = await resolveUserRole(
    session.user.id,
    sessionUser.role,
    phone
  );

  return {
    ...session,
    user: {
      ...session.user,
      role,
      phoneNumber: phone,
    },
  };
}

export async function requireSession() {
  const session = await getEnrichedSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireAdminSession() {
  const session = await requireSession();
  if (!isAdminRole(session.user.role)) {
    throw new Error("Forbidden");
  }
  return session;
}

export async function getCafeForOwner(ownerId: string) {
  await connectDB();
  return Cafe.findOne({ ownerId }).lean();
}

export async function isUserAdmin(userId: string, role?: string | null) {
  if (isAdminRole(role)) return true;
  const resolved = await resolveUserRole(userId, role);
  return resolved === "admin";
}
