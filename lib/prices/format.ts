import { parseDigits } from "@/lib/numerals";

export function parsePriceInput(value: string): number {
  const digits = parseDigits(value);
  return digits ? Number(digits) : 0;
}

export function formatPriceInput(value: string | number): string {
  const digits =
    typeof value === "number"
      ? String(Math.max(0, Math.floor(value)))
      : parseDigits(value);

  if (!digits) return "";
  return new Intl.NumberFormat("fa-IR").format(Number(digits));
}

export function isValidPriceInput(value: string): boolean {
  return parseDigits(value).length > 0;
}
