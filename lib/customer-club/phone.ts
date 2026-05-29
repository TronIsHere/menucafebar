import { parseTelInput } from "@/lib/numerals";

/** Normalize Iranian mobile numbers to E.164 (+98...) */
export function formatPhone(value: string): string {
  const cleaned = parseTelInput(value);
  if (cleaned.startsWith("0") && cleaned.length > 1) {
    return "+98" + cleaned.slice(1);
  }
  return cleaned;
}

export function isValidPhone(phone: string): boolean {
  return phone.startsWith("+98") && phone.length >= 13;
}
