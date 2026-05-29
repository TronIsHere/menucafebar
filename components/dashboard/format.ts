export function formatNum(n: number) {
  return new Intl.NumberFormat("fa-IR").format(n);
}

export function formatToman(n: number) {
  return formatNum(n) + " تومان";
}

export function formatTomanFull(n: number) {
  return formatToman(n);
}

export function formatTomanShort(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return formatNum(n);
}

export function calcTrend(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}
