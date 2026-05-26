import jalaali from "jalaali-js";

const PERSIAN_CALENDAR = "fa-IR-u-ca-persian";

export function formatJalaliDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(PERSIAN_CALENDAR, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function formatJalaliDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(PERSIAN_CALENDAR, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatJalaliTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(PERSIAN_CALENDAR, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function getTodayJalali(): { jy: number; jm: number; jd: number } {
  const now = new Date();
  return jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function formatJalaliParts(jy: number, jm: number, jd: number): string {
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  return formatJalaliDate(new Date(gy, gm - 1, gd));
}

export function parseJalaliDateString(value: string): Date | null {
  const normalized = value.trim().replace(/[۰-۹]/g, (c) =>
    String("۰۱۲۳۴۵۶۷۸۹".indexOf(c))
  );
  const match = normalized.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (!match) return null;

  const jy = parseInt(match[1], 10);
  const jm = parseInt(match[2], 10);
  const jd = parseInt(match[3], 10);
  if (!jalaali.isValidJalaaliDate(jy, jm, jd)) return null;

  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  return new Date(gy, gm - 1, gd);
}

export function jalaliDayRange(value: string): { start: Date; end: Date } | null {
  const day = parseJalaliDateString(value);
  if (!day) return null;
  const start = new Date(day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(day);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export function toJalaliInputValue(date: Date): string {
  const { jy, jm, jd } = jalaali.toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  return `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")}`;
}

export function getJalaliMonthRange(jy: number, jm: number): { start: Date; end: Date } {
  const daysInMonth = jalaali.jalaaliMonthLength(jy, jm);
  const startGreg = jalaali.toGregorian(jy, jm, 1);
  const endGreg = jalaali.toGregorian(jy, jm, daysInMonth);
  const start = new Date(startGreg.gy, startGreg.gm - 1, startGreg.gd, 0, 0, 0, 0);
  const end = new Date(endGreg.gy, endGreg.gm - 1, endGreg.gd, 23, 59, 59, 999);
  return { start, end };
}

export function getJalaliWeekRange(): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getDay();
  const saturdayOffset = (day + 1) % 7;
  const start = new Date(now);
  start.setDate(now.getDate() - saturdayOffset);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}
