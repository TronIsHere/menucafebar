import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import { Cafe } from "@/lib/db/models/Cafe";
import CheckoutClient from "./CheckoutClient";

interface Props {
  params: Promise<{ cafeSlug: string }>;
}

export default async function CheckoutPage({ params }: Props) {
  const { cafeSlug } = await params;
  await connectDB();
  const cafe = await Cafe.findOne({ slug: cafeSlug, isOnboardingComplete: true }).lean();
  if (!cafe) notFound();

  return (
    <CheckoutClient
      cafe={JSON.parse(JSON.stringify(cafe))}
    />
  );
}
