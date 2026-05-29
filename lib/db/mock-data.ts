export const DEMO_CAFE_SLUG = "aroma";
export const DEMO_PHONE = "+989121234567";
export const DEMO_OWNER_ID = "demo-owner-001";

export const menuTemplates = [
  {
    name: "کلاسیک",
    description: "طراحی ساده و شیک با پس‌زمینه روشن، مناسب برای کافه‌های سنتی",
    thumbnail: "/templates/classic.png",
    primaryColor: "#1a1a1a",
    accentColor: "#c8a96e",
    layoutType: "list" as const,
  },
  {
    name: "مدرن",
    description: "طراحی مینیمال و مدرن با کارت‌های بزرگ، مناسب برای کافه‌های شیک",
    thumbnail: "/templates/modern.png",
    primaryColor: "#2d2d2d",
    accentColor: "#e87c4e",
    layoutType: "grid" as const,
  },
  {
    name: "رنگارنگ",
    description: "طراحی پر انرژی با رنگ‌های جذاب، مناسب برای کافه‌های جوان",
    thumbnail: "/templates/colorful.png",
    primaryColor: "#6c3483",
    accentColor: "#f39c12",
    layoutType: "card" as const,
  },
  {
    name: "طبیعی",
    description: "طراحی الهام گرفته از طبیعت با رنگ‌های خاکی، مناسب برای کافه‌های ارگانیک",
    thumbnail: "/templates/natural.png",
    primaryColor: "#2c5f2e",
    accentColor: "#d4a853",
    layoutType: "grid" as const,
  },
];

export const demoCafe = {
  slug: DEMO_CAFE_SLUG,
  name: "کافه آروما",
  address: "خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲۳",
  city: "تهران",
  phone: "02188776655",
  openTime: "08:00",
  closeTime: "23:00",
  fridayOpenTime: "10:00",
  fridayCloseTime: "23:00",
  isOnboardingComplete: true,
};

export const demoCategories = [
  { name: "قهوه", icon: "lu:LuCoffee", order: 0 },
  { name: "نوشیدنی سرد", icon: "lu:LuCupSoda", order: 1 },
  { name: "دسر", icon: "lu:LuCake", order: 2 },
  { name: "صبحانه", icon: "lu:LuCroissant", order: 3 },
];

export const demoMenuItems = [
  { category: "قهوه", name: "اسپرسو", description: "یک شات اسپرسوی تازه", price: 85000, order: 0 },
  { category: "قهوه", name: "آمریکانو", description: "اسپرسو با آب داغ", price: 95000, order: 1 },
  { category: "قهوه", name: "کاپوچینو", description: "اسپرسو، شیر بخار داده شده و فوم", price: 125000, order: 2 },
  { category: "قهوه", name: "لاته", description: "اسپرسو با شیر بخار داده شده", price: 130000, order: 3 },
  { category: "قهوه", name: "موکا", description: "لاته با سس شکلات", price: 145000, order: 4 },
  { category: "قهوه", name: "کارامل ماکیاتو", description: "اسپرسو با سس کارامل و فوم شیر", price: 140000, order: 5 },
  { category: "نوشیدنی سرد", name: "آیس لاته", description: "لاته سرد با یخ", price: 135000, order: 0 },
  { category: "نوشیدنی سرد", name: "فراپوچینو", description: "نوشیدنی یخی با خامه", price: 155000, order: 1 },
  { category: "نوشیدنی سرد", name: "لیموناد", description: "لیمو تازه با نعنا", price: 90000, order: 2 },
  { category: "نوشیدنی سرد", name: "اسموتی توت", description: "توت فرنگی، موز و ماست", price: 120000, order: 3 },
  { category: "دسر", name: "چیزکیک", description: "چیزکیک نیویورکی", price: 110000, order: 0 },
  { category: "دسر", name: "براونی", description: "براونی شکلاتی با بستنی", price: 95000, order: 1 },
  { category: "دسر", name: "تیرامیسو", description: "تیرامیسو کلاسیک ایتالیایی", price: 115000, order: 2 },
  { category: "صبحانه", name: "املت", description: "املت با سبزیجات تازه", price: 105000, order: 0 },
  { category: "صبحانه", name: "پنکیک", description: "پنکیک با عسل و میوه", price: 98000, order: 1 },
  { category: "صبحانه", name: "صبحانه انگلیسی", description: "تخم مرغ، سوسیس، لوبیا و نان تست", price: 185000, order: 2 },
];

export const demoInventory = [
  { name: "دانه قهوه عربیکا", unit: "کیلوگرم", quantity: 12, lowThreshold: 5, cost: 850000 },
  { name: "شیر", unit: "لیتر", quantity: 8, lowThreshold: 10, cost: 45000 },
  { name: "شکر", unit: "کیلوگرم", quantity: 3, lowThreshold: 5, cost: 120000 },
  { name: "لیوان یکبار مصرف", unit: "عدد", quantity: 450, lowThreshold: 100, cost: 3500 },
  { name: "شکلات", unit: "کیلوگرم", quantity: 2, lowThreshold: 3, cost: 320000 },
  { name: "خامه", unit: "لیتر", quantity: 4, lowThreshold: 5, cost: 95000 },
  { name: "توت فرنگی منجمد", unit: "کیلوگرم", quantity: 6, lowThreshold: 3, cost: 180000 },
  { name: "نان تست", unit: "بسته", quantity: 15, lowThreshold: 5, cost: 55000 },
];

export const demoCustomers = [
  "علی رضایی",
  "مریم احمدی",
  "سارا محمدی",
  "رضا کریمی",
  "نازنین حسینی",
  "امیر نوری",
];
