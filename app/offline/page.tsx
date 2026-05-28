import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/brand";
import { AppLogo } from "@/components/brand/AppLogo";

export const metadata = {
  title: `آفلاین | ${APP_NAME}`,
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center bg-background">
      <AppLogo size="md" />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">اتصال اینترنت برقرار نیست</h1>
        <p className="text-muted-foreground max-w-sm">
          برای استفاده از {APP_NAME} به اینترنت نیاز دارید. اتصال خود را بررسی
          کنید و دوباره تلاش کنید.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild>
          <Link href="/">
            <RefreshCw className="w-4 h-4" />
            تلاش مجدد
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">داشبورد</Link>
        </Button>
      </div>
    </div>
  );
}
