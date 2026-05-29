import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import { Cafe } from "@/lib/db/models/Cafe";
import { Category } from "@/lib/db/models/Category";
import { MenuItem } from "@/lib/db/models/MenuItem";
import { getMenuTemplate, resolveCafeTemplateKey } from "@/lib/menu-templates";
import CustomerMenu from "./CustomerMenu";

interface Props {
  params: Promise<{ cafeSlug: string }>;
  searchParams: Promise<{ table?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { cafeSlug } = await params;
  await connectDB();
  const cafe = await Cafe.findOne({ slug: cafeSlug }).lean();
  if (!cafe) return { title: "کافه یافت نشد" };
  return {
    title: `منوی ${cafe.name}`,
    description: `منو آنلاین ${cafe.name} در ${cafe.city}`,
  };
}

export default async function CafeMenuPage({ params, searchParams }: Props) {
  const { cafeSlug } = await params;
  const { table: tableFromUrl } = await searchParams;
  await connectDB();

  const cafe = await Cafe.findOne({ slug: cafeSlug, isOnboardingComplete: true }).lean();
  if (!cafe) notFound();

  const [categories, items] = await Promise.all([
    Category.find({ cafeId: cafe._id.toString() }).sort({ order: 1 }).lean(),
    MenuItem.find({ cafeId: cafe._id.toString(), available: true })
      .sort({ order: 1 })
      .lean(),
  ]);

  const template = getMenuTemplate(resolveCafeTemplateKey(cafe));

  return (
    <CustomerMenu
      cafe={JSON.parse(JSON.stringify(cafe))}
      categories={JSON.parse(JSON.stringify(categories))}
      items={JSON.parse(JSON.stringify(items))}
      template={template}
      tableFromUrl={tableFromUrl}
    />
  );
}
