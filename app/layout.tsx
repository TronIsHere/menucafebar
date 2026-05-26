import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { DirectionProvider } from "@/components/providers/DirectionProvider";
import { PWARegister } from "@/components/providers/PWARegister";
import "./globals.css";

const iranSans = localFont({
  src: [
    {
      path: "../public/fonts/IRANSans-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANSans-Reg.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANSans-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANSans-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-iran-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MenuCafe | سیستم مدیریت کافه",
  description: "سیستم یکپارچه مدیریت منو، سفارشات و CRM کافه",
  applicationName: "MenuCafe",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MenuCafe",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#111827" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${iranSans.variable} h-full antialiased`}
    >
      <body className={`${iranSans.className} min-h-full flex flex-col`}>
        <PWARegister />
        <DirectionProvider>{children}</DirectionProvider>
        <Toaster
          richColors
          position="top-center"
          dir="rtl"
          style={{
            fontFamily:
              "var(--font-iran-sans), ui-sans-serif, system-ui, sans-serif",
          }}
        />
      </body>
    </html>
  );
}
