import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Full public URL for a cafe's customer menu (used in QR codes and sharing). */
export function getMenuPublicUrl(slug: string, tableNumber?: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://menucafe.ir";
  const url = `${base}/${slug}`;
  if (!tableNumber) return url;
  return `${url}?table=${encodeURIComponent(tableNumber)}`;
}
