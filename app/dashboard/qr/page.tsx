import { getSession, getCafeForOwner } from "@/lib/session";
import MenuQrCode from "@/components/dashboard/MenuQrCode";

export default async function QrCodePage() {
  const session = await getSession();
  const cafe = await getCafeForOwner(session!.user.id);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">QR کد منو</h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">
          QR کد اختصاصی {cafe!.name} برای چاپ و قرار دادن روی میزها
        </p>
      </div>
      <MenuQrCode
        cafeSlug={cafe!.slug}
        cafeName={cafe!.name}
        tableNumbers={cafe!.tableNumbers ?? []}
      />
    </div>
  );
}
