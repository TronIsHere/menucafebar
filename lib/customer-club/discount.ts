export function calculateDiscount(subtotal: number, discountPercent: number) {
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount);
  return { subtotal, discountPercent, discountAmount, total };
}
