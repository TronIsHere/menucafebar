# MenuCafe — سیستم مدیریت کافه

سیستم یکپارچه مدیریت منو، سفارشات، پیشخدمت، آمار و CRM برای کافه‌ها.

## امکانات

- **احراز هویت**: ورود با شماره موبایل + کد OTP (بدون نیاز به رمز عبور)
- **راه‌اندازی کافه**: ویزارد ۳ مرحله‌ای برای ثبت اطلاعات کافه
- **مدیریت منو**: انتخاب قالب، مدیریت دسته‌بندی و آیتم‌ها با قیمت به تومان
- **سفارشات زنده**: بورد کانبان با به‌روزرسانی آنی (SSE)
- **حالت پیشخدمت**: ثبت سریع سفارش توسط پیشخدمت
- **منوی مشتری**: صفحه عمومی `/[cafeSlug]` با سبد خرید و تایید سفارش
- **آمار**: نمودار درآمد روزانه و پرفروش‌ترین آیتم‌ها
- **CRM و انبار**: مدیریت موجودی با هشدار کم‌بودی، تاریخچه مشتریان

## تکنولوژی

| لایه | ابزار |
|---|---|
| Framework | Next.js 16 App Router |
| Database | MongoDB + Mongoose |
| Auth | Better Auth + phoneNumber plugin |
| UI | shadcn/ui + Tailwind CSS v4 |
| Real-time | Server-Sent Events (SSE) |
| Charts | Recharts |
| State | Zustand (cart) |
| Validation | Zod + React Hook Form |

## شروع کار

### ۱. متغیرهای محیطی

فایل `.env.local` را ویرایش کنید:

```env
MONGODB_URI=mongodb://localhost:27017/menucaffe
BETTER_AUTH_SECRET=your-secret-min-32-chars
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Kavenegar — ارسال SMS OTP (Verify Lookup)
KAVENEGAR_API_KEY=
KAVENEGAR_VERIFY_TEMPLATE=verify
```

### ۲. Seed قالب‌های منو

```bash
npm run seed
```

### ۳. اجرا

```bash
npm run dev
```

## ساختار مسیرها

```
/login                     # ورود با موبایل + OTP
/onboarding                # راه‌اندازی اولیه کافه
/dashboard                 # داشبورد مالک
/dashboard/orders          # سفارشات زنده (Kanban)
/dashboard/menu            # منوساز (قالب + دسته + آیتم)
/dashboard/analytics       # آمار درآمد و پرفروش‌ها
/dashboard/crm             # انبار + مشتریان
/dashboard/settings        # تنظیمات کافه
/waiter                    # حالت پیشخدمت
/[cafeSlug]                # منوی عمومی مشتری
/[cafeSlug]/checkout       # سبد و تایید سفارش
```

## SMS در محیط توسعه

در محیط توسعه، اگر `KAVENEGAR_API_KEY` یا `KAVENEGAR_VERIFY_TEMPLATE` خالی باشد، کد OTP در `console.log` چاپ می‌شود.
