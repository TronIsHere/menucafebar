export interface Cafe {
  _id: string;
  name: string;
  address: string;
  city: string;
  openTime: string;
  closeTime: string;
  slug: string;
  tableNumbers?: string[];
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
