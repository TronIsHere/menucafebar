import { getSession, getCafeForOwner } from "@/lib/session";
import { connectDB } from "@/lib/db/mongoose";
import { Category } from "@/lib/db/models/Category";
import { MenuItem } from "@/lib/db/models/MenuItem";
import { MenuTemplate } from "@/lib/db/models/MenuTemplate";
import MenuBuilder from "./MenuBuilder";

export default async function MenuPage() {
  const session = await getSession();
  const cafe = await getCafeForOwner(session!.user.id);

  await connectDB();

  const [categories, templates] = await Promise.all([
    Category.find({ cafeId: cafe!._id.toString() })
      .sort({ order: 1 })
      .lean(),
    MenuTemplate.find().lean(),
  ]);

  const items = await MenuItem.find({ cafeId: cafe!._id.toString() })
    .sort({ order: 1 })
    .lean();

  return (
    <div className="p-4 sm:p-6">
      <MenuBuilder
        cafeId={cafe!._id.toString()}
        cafeSlug={cafe!.slug}
        cafeName={cafe!.name}
        tableNumbers={cafe!.tableNumbers ?? []}
        currentTemplateId={cafe!.templateId}
        initialCategories={JSON.parse(JSON.stringify(categories))}
        initialItems={JSON.parse(JSON.stringify(items))}
        templates={JSON.parse(JSON.stringify(templates))}
      />
    </div>
  );
}
