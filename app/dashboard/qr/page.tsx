import { getSession, getCafeForOwner } from "@/lib/session";
import MenuQrCode from "@/components/dashboard/MenuQrCode";
import { DashboardPage, DashboardPageHeader } from "@/components/dashboard/shell";

export default async function QrCodePage() {
  const session = await getSession();
  const cafe = await getCafeForOwner(session!.user.id);

  return (
    <DashboardPage size="narrow">
      <DashboardPageHeader
        title="QR کد منو"
        description={`QR کد اختصاصی ${cafe!.name} برای چاپ و قرار دادن روی میزها`}
      />
      <MenuQrCode
        cafeSlug={cafe!.slug}
        cafeName={cafe!.name}
        tableNumbers={cafe!.tableNumbers ?? []}
      />
    </DashboardPage>
  );
}
