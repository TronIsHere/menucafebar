import { notFound } from "next/navigation";
import { getOrderForCustomer } from "@/lib/orders/get-order-for-customer";
import OrderTrackingClient from "./OrderTrackingClient";

interface Props {
  params: Promise<{ cafeSlug: string; orderId: string }>;
}

export default async function OrderTrackingPage({ params }: Props) {
  const { cafeSlug, orderId } = await params;
  const result = await getOrderForCustomer(orderId, cafeSlug);
  if (!result) notFound();

  return (
    <OrderTrackingClient
      cafeSlug={cafeSlug}
      cafeName={result.cafeName}
      initialOrder={result.order}
    />
  );
}
