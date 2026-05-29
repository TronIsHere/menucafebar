"use client";

import { useRef } from "react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Download, ExternalLink, Printer, QrCode } from "@/lib/icons/app-icons";
import { getMenuPublicUrl } from "@/lib/utils";

interface Props {
  cafeSlug: string;
  cafeName?: string;
  tableNumbers?: string[];
}

function TableQrTile({
  cafeSlug,
  cafeName,
  tableNumber,
}: {
  cafeSlug: string;
  cafeName?: string;
  tableNumber: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const menuUrl = getMenuPublicUrl(cafeSlug, tableNumber);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(menuUrl);
      toast.success(`لینک میز ${tableNumber} کپی شد`);
    } catch {
      toast.error("کپی لینک ممکن نشد");
    }
  }

  function downloadPng() {
    const dataUrl = canvasRef.current?.toDataURL("image/png") ?? "";
    if (!dataUrl) {
      toast.error("دانلود QR انجام نشد");
      return;
    }

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `menu-qr-${cafeSlug}-table-${tableNumber}.png`;
    link.click();
    toast.success(`QR میز ${tableNumber} دانلود شد`);
  }

  function printQr() {
    const dataUrl = canvasRef.current?.toDataURL("image/png") ?? "";
    if (!dataUrl) {
      toast.error("چاپ QR انجام نشد");
      return;
    }

    const title = cafeName ? `میز ${tableNumber} — ${cafeName}` : `میز ${tableNumber}`;
    const win = window.open("", "_blank", "noopener,noreferrer");
    if (!win) {
      toast.error("پاپ‌آپ مسدود است. اجازه باز شدن پنجره را بدهید.");
      return;
    }

    win.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="fa">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      body { font-family: system-ui, sans-serif; text-align: center; padding: 2rem; }
      img { width: 240px; height: 240px; }
      p { margin-top: 1rem; font-size: 13px; color: #374151; direction: ltr; }
      h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
      h2 { font-size: 1rem; color: #6b7280; font-weight: 500; margin-bottom: 1rem; }
    </style>
  </head>
  <body>
    <h1>میز ${tableNumber}</h1>
    ${cafeName ? `<h2>${cafeName}</h2>` : ""}
    <img src="${dataUrl}" alt="QR میز ${tableNumber}" />
    <p>${menuUrl}</p>
    <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); };</script>
  </body>
</html>`);
    win.document.close();
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm font-bold">میز {tableNumber}</p>
      <QRCodeCanvas ref={canvasRef} value={menuUrl} size={160} level="M" includeMargin />
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={copyLink}>
          <Copy className="w-3.5 h-3.5 ml-1.5" />
          کپی
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={downloadPng}>
          <Download className="w-3.5 h-3.5 ml-1.5" />
          دانلود
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={printQr}>
          <Printer className="w-3.5 h-3.5 ml-1.5" />
          چاپ
        </Button>
      </div>
    </div>
  );
}

export default function MenuQrCode({ cafeSlug, cafeName, tableNumbers = [] }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const menuUrl = getMenuPublicUrl(cafeSlug);

  function getQrDataUrl() {
    return canvasRef.current?.toDataURL("image/png") ?? "";
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(menuUrl);
      toast.success("لینک منو کپی شد");
    } catch {
      toast.error("کپی لینک ممکن نشد");
    }
  }

  function downloadPng() {
    const dataUrl = getQrDataUrl();
    if (!dataUrl) {
      toast.error("دانلود QR انجام نشد");
      return;
    }

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `menu-qr-${cafeSlug}.png`;
    link.click();
    toast.success("QR کد دانلود شد");
  }

  function printQr() {
    const dataUrl = getQrDataUrl();
    if (!dataUrl) {
      toast.error("چاپ QR انجام نشد");
      return;
    }

    const title = cafeName ? `منوی ${cafeName}` : "منوی دیجیتال";
    const win = window.open("", "_blank", "noopener,noreferrer");
    if (!win) {
      toast.error("پاپ‌آپ مسدود است. اجازه باز شدن پنجره را بدهید.");
      return;
    }

    win.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="fa">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      body { font-family: system-ui, sans-serif; text-align: center; padding: 2rem; }
      img { width: 280px; height: 280px; }
      p { margin-top: 1rem; font-size: 14px; color: #374151; direction: ltr; }
      h1 { font-size: 1.25rem; margin-bottom: 1rem; }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <img src="${dataUrl}" alt="QR منو" />
    <p>${menuUrl}</p>
    <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); };</script>
  </body>
</html>`);
    win.document.close();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR کد منو
          </CardTitle>
          <CardDescription>
            {tableNumbers.length > 0
              ? "QR عمومی منو برای ویترین یا اشتراک‌گذاری. برای میزها از QRهای اختصاصی پایین استفاده کنید."
              : "این QR را روی میزها، ویترین یا رسانه‌های چاپی قرار دهید تا مشتریان مستقیم به منوی آنلاین شما بروند."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="flex shrink-0 items-center justify-center rounded-xl border bg-white p-4 shadow-sm">
            <QRCodeCanvas
              ref={canvasRef}
              value={menuUrl}
              size={280}
              level="M"
              includeMargin
            />
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-1">
            <div className="space-y-2">
              <p className="text-sm font-medium">لینک منو</p>
              <div className="flex gap-2">
                <Input value={menuUrl} readOnly dir="ltr" className="font-mono text-sm" />
                <Button type="button" variant="outline" size="icon" onClick={copyLink} aria-label="کپی لینک">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={downloadPng}>
                <Download className="w-4 h-4 ml-2" />
                دانلود PNG
              </Button>
              <Button type="button" variant="outline" onClick={printQr}>
                <Printer className="w-4 h-4 ml-2" />
                پرینت QR
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/${cafeSlug}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 ml-2" />
                  پیش‌نمایش منو
                </Link>
              </Button>
            </div>

            <p className="text-muted-foreground text-xs leading-relaxed">
              در محیط توسعه، QR به آدرس localhost اشاره می‌کند. در production با تنظیم{" "}
              <code className="rounded bg-muted px-1 text-[11px]" dir="ltr">
                NEXT_PUBLIC_APP_URL
              </code>{" "}
              لینک نهایی (مثلاً menucafe.ir) در QR قرار می‌گیرد.
            </p>
          </div>
        </CardContent>
      </Card>

      {tableNumbers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>QR کد میزها</CardTitle>
            <CardDescription>
              هر QR را روی میز مربوطه قرار دهید. مشتری با اسکن، مستقیم میز خود را در سبد سفارش
              می‌بیند.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tableNumbers.map((tableNumber) => (
                <TableQrTile
                  key={tableNumber}
                  cafeSlug={cafeSlug}
                  cafeName={cafeName}
                  tableNumber={tableNumber}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
