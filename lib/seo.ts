import type { Metadata } from "next";
import { APP_LOGO, APP_NAME, APP_TAGLINE, APP_TITLE } from "@/lib/brand";

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://menucafe.ir";

export const SITE_DESCRIPTION =
  "منوی دیجیتال QR، مدیریت سفارشات، CRM مشتریان و گزارش فروش. ثبت‌نام رایگان — راه‌اندازی در چند دقیقه برای کافه، رستوران و فست‌فود.";

export const SITE_KEYWORDS = [
  "منوی دیجیتال",
  "منوی QR",
  "مدیریت کافه",
  "سیستم سفارشگیری کافه",
  "CRM کافه",
  "نرم‌افزار رستوران",
  "منوی آنلاین",
  "مدیریت سفارشات کافه",
  APP_NAME,
];

export const NO_INDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

export function createMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  robots,
  keywords = SITE_KEYWORDS,
}: {
  title: string;
  description?: string;
  path?: string;
  robots?: Metadata["robots"];
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl("/opengraph-image");

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: path },
    robots,
    openGraph: {
      type: "website",
      locale: "fa_IR",
      url,
      siteName: APP_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${APP_NAME} — ${APP_TAGLINE}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const rootMetadata: Metadata = {
  ...createMetadata({
    title: APP_TITLE,
    description: SITE_DESCRIPTION,
    path: "/",
  }),
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: APP_LOGO, type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  formatDetection: {
    telephone: false,
  },
};

export const landingMetadata: Metadata = createMetadata({
  title: `${APP_NAME} | منوی دیجیتال QR و مدیریت کافه رایگان`,
  description: SITE_DESCRIPTION,
  path: "/",
});

export const appRouteMetadata: Metadata = {
  robots: NO_INDEX_ROBOTS,
};
