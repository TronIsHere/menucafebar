const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Strip grouping and normalize Persian/Arabic digits to ASCII digits. */
export function parsePriceDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[^\d]/g, "");
}

export function parsePriceInput(value: string): number {
  const digits = parsePriceDigits(value);
  return digits ? Number(digits) : 0;
}

export function formatPriceInput(value: string | number): string {
  const digits =
    typeof value === "number"
      ? String(Math.max(0, Math.floor(value)))
      : parsePriceDigits(value);

  if (!digits) return "";
  return new Intl.NumberFormat("fa-IR").format(Number(digits));
}

export function isValidPriceInput(value: string): boolean {
  const digits = parsePriceDigits(value);
  return digits.length > 0;
}
