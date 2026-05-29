export const SUPPORT_PHONE = "09306613683";
export const SUPPORT_PHONE_DISPLAY = "۰۹۳۰۶۶۱۳۶۸۳";

export const TICKET_STATUSES = [
  "open",
  "in_progress",
  "waiting",
  "resolved",
  "closed",
] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const TICKET_CATEGORIES = [
  "general",
  "technical",
  "billing",
  "menu",
  "orders",
  "feature",
] as const;

export type TicketCategory = (typeof TICKET_CATEGORIES)[number];

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: "باز",
  in_progress: "در حال بررسی",
  waiting: "منتظر پاسخ شما",
  resolved: "حل شده",
  closed: "بسته شده",
};

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: "کم",
  normal: "معمولی",
  high: "بالا",
  urgent: "فوری",
};

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
  general: "عمومی",
  technical: "فنی",
  billing: "مالی",
  menu: "منو",
  orders: "سفارشات",
  feature: "درخواست قابلیت",
};

export const AUTHOR_ROLE_LABELS = {
  owner: "شما",
  admin: "پشتیبانی",
} as const;
