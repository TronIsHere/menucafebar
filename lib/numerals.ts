const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Convert Persian/Arabic-Indic digits to ASCII (0-9). Other characters unchanged. */
export function toLatinDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)));
}

/** Convert ASCII (0-9) digits to Persian numerals for display. */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/** Digits only (ASCII), after normalizing Persian/Arabic numerals. */
export function parseDigits(value: string): string {
  return toLatinDigits(value).replace(/\D/g, "");
}

/** Phone/tel input: keep + and digits after normalizing numerals. */
export function parseTelInput(value: string): string {
  return toLatinDigits(value).replace(/[^\d+]/g, "");
}

/** OTP / short codes: digits only, optional max length. */
export function parseOtpInput(value: string, maxLength?: number): string {
  const digits = parseDigits(value);
  return maxLength != null ? digits.slice(0, maxLength) : digits;
}

export function parseIntInput(value: string): number {
  const digits = parseDigits(value);
  if (!digits) return NaN;
  return parseInt(digits, 10);
}

export function parseFloatInput(value: string): number {
  const latin = toLatinDigits(value).replace(/[^\d.]/g, "");
  if (!latin) return NaN;
  return parseFloat(latin);
}

export function isNumericInputType(type?: string, inputMode?: string): boolean {
  return (
    type === "number" ||
    type === "tel" ||
    inputMode === "numeric" ||
    inputMode === "tel" ||
    inputMode === "decimal"
  );
}

export function normalizeNumericInputValue(
  value: string,
  type?: string,
  inputMode?: string
): string {
  if (type === "tel" || inputMode === "tel") {
    return parseTelInput(value);
  }
  if (inputMode === "decimal") {
    const latin = toLatinDigits(value).replace(/[^\d.]/g, "");
    const [whole, ...rest] = latin.split(".");
    return rest.length > 0 ? `${whole}.${rest.join("")}` : whole;
  }
  return parseDigits(value);
}
