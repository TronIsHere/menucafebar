export interface Cafe {
  _id: string;
  name: string;
  address: string;
  city: string;
  openTime: string;
  closeTime: string;
  fridayOpenTime?: string;
  fridayCloseTime?: string;
  slug: string;
  tableNumbers?: string[];
}

/**
 * Working hours for the current day in Tehran. Friday often has different
 * hours than Saturday–Thursday, so we surface the right range to visitors.
 */
export function cafeHoursToday(cafe: Cafe): { open: string; close: string } {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    weekday: "long",
  }).format(new Date());

  if (weekday === "Friday" && cafe.fridayOpenTime && cafe.fridayCloseTime) {
    return { open: cafe.fridayOpenTime, close: cafe.fridayCloseTime };
  }
  return { open: cafe.openTime, close: cafe.closeTime };
}

export function cafeHoursLabel(cafe: Cafe, separator = "–"): string {
  const { open, close } = cafeHoursToday(cafe);
  return `${open}${separator}${close}`;
}

export interface Category {
  _id: string;
  name: string;
  icon?: string;
}

export interface MenuItem {
  _id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export interface Template {
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  cardBg: string;
  textColor: string;
  darkMode: boolean;
  templateKey: string;
}

export interface TemplateProps {
  cafe: Cafe;
  categories: Category[];
  items: MenuItem[];
  template: Template;
}

export function fmt(n: number) {
  return new Intl.NumberFormat("fa-IR").format(n) + " تومان";
}
