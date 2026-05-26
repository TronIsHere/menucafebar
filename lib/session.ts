import { headers } from "next/headers";
import { auth } from "./auth";
import { connectDB } from "./db/mongoose";
import { Cafe } from "./db/models/Cafe";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getCafeForOwner(ownerId: string) {
  await connectDB();
  return Cafe.findOne({ ownerId }).lean();
}
