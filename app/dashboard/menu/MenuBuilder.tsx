"use client";

import { useRef, useState, type DragEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  CheckCircle,
  UtensilsCrossed,
  QrCode,
  X,
} from "@/lib/icons/app-icons";
import IconPicker from "@/components/icons/IconPicker";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import MenuQrCode from "@/components/dashboard/MenuQrCode";
import { getMenuPublicUrl } from "@/lib/utils";
import {
  formatPriceInput,
  isValidPriceInput,
  parsePriceInput,
} from "@/lib/prices/format";

interface Category {
  _id: string;
  name: string;
  icon?: string;
}

interface MenuItem {
  _id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  imageUrl?: string;
}

interface Template {
  templateKey: string;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  bgColor?: string;
  cardBg?: string;
  textColor?: string;
  layoutType: "grid" | "list" | "card" | "magazine" | "sidebar" | "accordion" | "bento" | "retro" | "tiles";
  headerStyle?: "standard" | "minimal" | "hero";
  darkMode?: boolean;
  borderRadius?: "sharp" | "rounded" | "pill";
  categoryTabStyle?: "pill" | "underline" | "chip";
}

interface Props {
  cafeId: string;
  cafeSlug: string;
  cafeName?: string;
  tableNumbers?: string[];
  currentTemplateKey?: string;
  initialCategories: Category[];
  initialItems: MenuItem[];
  templates: Template[];
}

function formatToman(n: number) {
  return new Intl.NumberFormat("fa-IR").format(n) + " تومان";
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function MenuBuilder({
  cafeSlug,
  cafeName,
  tableNumbers = [],
  currentTemplateKey,
  initialCategories,
  initialItems,
  templates,
}: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(currentTemplateKey);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    initialCategories[0]?._id ?? ""
  );

  // Category dialog
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");

  // Item dialog
  const [itemDialog, setItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    available: true,
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadName, setImageUploadName] = useState("");
  const [isImageDragging, setIsImageDragging] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // ── Template selection ──────────────────────────────────────────────────────
  async function selectTemplate(templateKey: string) {
    const res = await fetch("/api/cafe", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateKey }),
    });
    if (res.ok) {
      setSelectedTemplateKey(templateKey);
      toast.success("قالب انتخاب شد");
    } else {
      toast.error("خطا در انتخاب قالب");
    }
  }

  // ── Category CRUD ───────────────────────────────────────────────────────────
  function openNewCategory() {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryIcon("");
    setCategoryDialog(true);
  }

  function openEditCategory(cat: Category) {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryIcon(cat.icon || "");
    setCategoryDialog(true);
  }

  async function saveCategory() {
    if (!categoryName.trim()) {
      toast.error("نام دسته‌بندی را وارد کنید");
      return;
    }
    setLoading(true);
    try {
      if (editingCategory) {
        const res = await fetch(`/api/menu/categories/${editingCategory._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryName, icon: categoryIcon }),
        });
        if (!res.ok) throw new Error();
        setCategories((prev) =>
          prev.map((c) =>
            c._id === editingCategory._id
              ? { ...c, name: categoryName, icon: categoryIcon }
              : c
          )
        );
        toast.success("دسته‌بندی ویرایش شد");
      } else {
        const res = await fetch("/api/menu/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryName, icon: categoryIcon }),
        });
        if (!res.ok) throw new Error();
        const { category } = await res.json();
        setCategories((prev) => [...prev, category]);
        if (!activeCategoryId) setActiveCategoryId(category._id);
        toast.success("دسته‌بندی اضافه شد");
      }
      setCategoryDialog(false);
    } catch {
      toast.error("خطا در ذخیره دسته‌بندی");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("آیا از حذف این دسته‌بندی و تمام آیتم‌های آن مطمئنید؟")) return;
    const res = await fetch(`/api/menu/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c._id !== id));
      setItems((prev) => prev.filter((i) => i.categoryId !== id));
      if (activeCategoryId === id) setActiveCategoryId(categories[0]?._id ?? "");
      toast.success("دسته‌بندی حذف شد");
    } else {
      toast.error("خطا در حذف");
    }
  }

  // ── Item CRUD ───────────────────────────────────────────────────────────────
  function openNewItem() {
    setEditingItem(null);
    setItemForm({ name: "", description: "", price: "", available: true, imageUrl: "" });
    setItemDialog(true);
  }

  function openEditItem(item: MenuItem) {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      description: item.description || "",
      price: formatPriceInput(item.price),
      available: item.available,
      imageUrl: item.imageUrl || "",
    });
    setItemDialog(true);
  }

  function validateImageFile(file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("فرمت تصویر پشتیبانی نمی‌شود");
      return false;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("حجم تصویر باید کمتر از ۵ مگابایت باشد");
      return false;
    }
    return true;
  }

  async function handleImageUpload(file: File) {
    if (!validateImageFile(file)) return;

    setImageUploadName(file.name);
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Upload failed");
      }
      const { url } = await res.json();
      setItemForm((f) => ({ ...f, imageUrl: url }));
      toast.success("تصویر آپلود شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در آپلود تصویر");
    } finally {
      setUploadingImage(false);
      setImageUploadName("");
    }
  }

  function handleImageDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsImageDragging(false);
    if (uploadingImage) return;

    const file = event.dataTransfer.files?.[0];
    if (file) void handleImageUpload(file);
  }

  async function saveItem() {
    if (!itemForm.name.trim()) {
      toast.error("نام آیتم را وارد کنید");
      return;
    }
    if (!isValidPriceInput(itemForm.price)) {
      toast.error("قیمت معتبر وارد کنید");
      return;
    }
    const price = parsePriceInput(itemForm.price);
    if (!activeCategoryId) {
      toast.error("ابتدا یک دسته‌بندی انتخاب کنید");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: itemForm.name,
        description: itemForm.description,
        price,
        available: itemForm.available,
        categoryId: activeCategoryId,
        imageUrl: itemForm.imageUrl,
      };
      if (editingItem) {
        const res = await fetch(`/api/menu/items/${editingItem._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        setItems((prev) =>
          prev.map((i) => (i._id === editingItem._id ? { ...i, ...payload } : i))
        );
        toast.success("آیتم ویرایش شد");
      } else {
        const res = await fetch("/api/menu/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const { item } = await res.json();
        setItems((prev) => [...prev, item]);
        toast.success("آیتم اضافه شد");
      }
      setItemDialog(false);
    } catch {
      toast.error("خطا در ذخیره آیتم");
    } finally {
      setLoading(false);
    }
  }

  async function toggleAvailability(item: MenuItem) {
    const res = await fetch(`/api/menu/items/${item._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !item.available }),
    });
    if (res.ok) {
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, available: !i.available } : i))
      );
    }
  }

  async function deleteItem(id: string) {
    const res = await fetch(`/api/menu/items/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success("آیتم حذف شد");
    } else {
      toast.error("خطا در حذف");
    }
  }

  const activeItems = items.filter((i) => i.categoryId === activeCategoryId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:block">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">مدیریت منو</h1>
          <p className="text-muted-foreground text-sm mt-1 break-all">
            آدرس منوی شما:{" "}
            <a
              href={`/${cafeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
              dir="ltr"
            >
              {getMenuPublicUrl(cafeSlug).replace(/^https?:\/\//, "")}{" "}
              <ExternalLink className="inline w-3 h-3 shrink-0" />
            </a>
          </p>
        </div>
      </div>

      <Tabs defaultValue="menu">
        <TabsList className="w-full h-auto flex-wrap sm:flex-nowrap justify-start gap-1">
          <TabsTrigger value="menu" className="flex-1 sm:flex-none">منو و آیتم‌ها</TabsTrigger>
          <TabsTrigger value="templates" className="flex-1 sm:flex-none">انتخاب قالب</TabsTrigger>
          <TabsTrigger value="qr" className="flex-1 sm:flex-none gap-1.5">
            <QrCode className="w-3.5 h-3.5 hidden sm:inline" />
            QR کد
          </TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="pt-4">
          <MenuQrCode cafeSlug={cafeSlug} cafeName={cafeName} tableNumbers={tableNumbers} />
        </TabsContent>

        {/* ── Template Picker ──── */}
        <TabsContent value="templates" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {templates.map((tpl) => {
              const bg   = tpl.bgColor  ?? "#f9fafb";
              const card = tpl.cardBg   ?? "#ffffff";
              const text = tpl.textColor ?? "#111827";
              const br   = tpl.borderRadius ?? "rounded";
              const tabs = tpl.categoryTabStyle ?? "pill";
              const cardR = br === "sharp" ? 4 : br === "pill" ? 12 : 8;
              const imgBg = tpl.darkMode ? `${tpl.primaryColor}cc` : "#e5e5e5";
              const layoutLabel =
                tpl.layoutType === "grid" ? "شبکه‌ای" :
                tpl.layoutType === "list" ? "لیستی" :
                tpl.layoutType === "magazine" ? "مجله‌ای" :
                tpl.layoutType === "sidebar" ? "سایدبار" :
                tpl.layoutType === "accordion" ? "آکاردئون" :
                tpl.layoutType === "bento" ? "بنتو" :
                tpl.layoutType === "retro" ? "رترو" :
                tpl.layoutType === "tiles" ? "کاشی" : "کارتی";
              const tabLabel =
                tabs === "underline" ? "تب خطی" : tabs === "chip" ? "چیپ" : "قرص";
              const radiusLabel =
                br === "sharp" ? "لبه تیز" : br === "pill" ? "گرد" : "معمولی";
              const headerLabel =
                tpl.headerStyle === "hero"
                  ? "هدر بزرگ"
                  : tpl.headerStyle === "minimal"
                  ? "هدر کوچک"
                  : "هدر استاندارد";

              const headerBg = tpl.headerStyle === "hero"
                ? `linear-gradient(140deg, ${tpl.primaryColor} 0%, ${tpl.primaryColor}dd 60%, ${tpl.accentColor}55 100%)`
                : tpl.primaryColor;

              return (
                <div
                  key={tpl.templateKey}
                  onClick={() => selectTemplate(tpl.templateKey)}
                  className={`cursor-pointer rounded-xl overflow-hidden transition-all hover:scale-[1.01] ${
                    selectedTemplateKey === tpl.templateKey
                      ? "ring-2 ring-primary shadow-lg"
                      : "ring-1 ring-border hover:shadow-md"
                  }`}
                >
                  {/* ── Mini phone preview ── */}
                  <div className="relative overflow-hidden select-none" style={{ height: 210, backgroundColor: bg }}>

                    {/* Header */}
                    <div style={{
                      background: headerBg,
                      padding: tpl.headerStyle === "hero" ? "14px 10px 12px" : tpl.headerStyle === "minimal" ? "8px 10px" : "10px 10px",
                    }}>
                      {tpl.headerStyle === "hero" && (
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 6, margin: "0 0 3px", letterSpacing: "0.1em" }}>شهر</p>
                      )}
                      <p style={{ color: "#fff", fontSize: 9.5, fontWeight: 700, margin: 0 }}>نام کافه</p>
                      {tpl.headerStyle !== "minimal" && (
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 6.5, margin: "2px 0 0" }}>تهران — ۸ تا ۱۰</p>
                      )}
                      {tpl.headerStyle === "hero" && (
                        <div style={{ width: 20, height: 2, backgroundColor: tpl.accentColor, borderRadius: 99, marginTop: 6 }} />
                      )}
                    </div>

                    {/* Category tabs */}
                    <div style={{
                      display: "flex", gap: 3, padding: tabs === "underline" ? "0 8px" : "5px 8px",
                      backgroundColor: tabs === "underline" ? card : `${tpl.primaryColor}ee`,
                      borderBottom: tabs === "underline" ? `1px solid ${tpl.accentColor}35` : "none",
                    }}>
                      {["دسته۱", "دسته۲"].map((lbl, idx) => {
                        const active = idx === 0;
                        if (tabs === "underline") return (
                          <span key={lbl} style={{ fontSize: 6.5, fontWeight: active ? 700 : 500, padding: "5px 6px 4px", color: active ? tpl.primaryColor : "rgba(0,0,0,0.4)", borderBottom: `1.5px solid ${active ? tpl.accentColor : "transparent"}` }}>{lbl}</span>
                        );
                        if (tabs === "chip") return (
                          <span key={lbl} style={{ fontSize: 6, padding: "2px 6px", borderRadius: cardR, border: `1px solid ${active ? tpl.accentColor : "rgba(255,255,255,0.3)"}`, backgroundColor: active ? tpl.accentColor : "transparent", color: active ? (tpl.darkMode ? tpl.primaryColor : "#fff") : "rgba(255,255,255,0.7)" }}>{lbl}</span>
                        );
                        return (
                          <span key={lbl} style={{ fontSize: 6, padding: "2.5px 7px", borderRadius: 99, backgroundColor: active ? tpl.accentColor : "transparent", color: active ? (tpl.darkMode ? tpl.primaryColor : "#fff") : "rgba(255,255,255,0.7)" }}>{lbl}</span>
                        );
                      })}
                    </div>

                    {/* Items preview */}
                    <div style={{ padding: "6px 7px 0" }}>
                      {tpl.layoutType === "list" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {[1, 2].map((i) => (
                            <div key={i} style={{ display: "flex", height: 26, borderRadius: cardR, overflow: "hidden", backgroundColor: card, border: br === "sharp" ? `1px solid rgba(0,0,0,0.07)` : "none", boxShadow: br !== "sharp" ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
                              <div style={{ width: 26, backgroundColor: imgBg, flexShrink: 0 }} />
                              <div style={{ padding: "4px 7px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 2.5, flex: 1 }}>
                                <div style={{ height: 4, width: "60%", borderRadius: 2, backgroundColor: `${text}55` }} />
                                <div style={{ height: 3, width: "35%", borderRadius: 2, backgroundColor: `${tpl.accentColor}bb` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {tpl.layoutType === "grid" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                          {[1, 2].map((i) => (
                            <div key={i} style={{ borderRadius: cardR, overflow: "hidden", backgroundColor: card, border: br === "sharp" ? `1px solid rgba(0,0,0,0.07)` : "none", boxShadow: br !== "sharp" ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
                              <div style={{ height: 32, backgroundColor: imgBg }} />
                              <div style={{ padding: "4px 5px 5px", display: "flex", flexDirection: "column", gap: 3 }}>
                                <div style={{ height: 4, width: "75%", borderRadius: 2, backgroundColor: `${text}55` }} />
                                <div style={{ height: 3, width: "45%", borderRadius: 2, backgroundColor: tpl.accentColor }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {tpl.layoutType === "card" && (
                        <div style={{ borderRadius: cardR, overflow: "hidden", backgroundColor: card, border: br === "sharp" ? `1px solid rgba(0,0,0,0.07)` : "none", boxShadow: br !== "sharp" ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
                          <div style={{ height: 52, backgroundColor: imgBg }} />
                          <div style={{ padding: "6px 8px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <div style={{ height: 5, width: 52, borderRadius: 2, backgroundColor: `${text}66`, marginBottom: 3 }} />
                              <div style={{ height: 3.5, width: 32, borderRadius: 2, backgroundColor: tpl.accentColor }} />
                            </div>
                            <div style={{ height: 14, width: 26, borderRadius: br === "pill" ? 99 : 3, backgroundColor: tpl.primaryColor }} />
                          </div>
                        </div>
                      )}

                      {tpl.layoutType === "magazine" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <div style={{ borderRadius: cardR, overflow: "hidden", backgroundColor: card, border: br === "sharp" ? `1px solid rgba(0,0,0,0.07)` : "none" }}>
                            <div style={{ height: 48, backgroundColor: imgBg, position: "relative" }}>
                              <div style={{ position: "absolute", top: 5, right: 5, backgroundColor: tpl.accentColor, borderRadius: 3, padding: "1.5px 5px" }}>
                                <span style={{ fontSize: 5, color: tpl.darkMode ? tpl.primaryColor : "#1a1a1a", fontWeight: 700 }}>ویژه</span>
                              </div>
                            </div>
                            <div style={{ padding: "5px 7px 7px" }}>
                              <div style={{ height: 5, width: 60, borderRadius: 2, backgroundColor: `${text}66`, marginBottom: 3 }} />
                              <div style={{ height: 3, width: 36, borderRadius: 2, backgroundColor: tpl.accentColor }} />
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                            {[1, 2].map((i) => (
                              <div key={i} style={{ borderRadius: cardR, overflow: "hidden", backgroundColor: card }}>
                                <div style={{ height: 20, backgroundColor: imgBg }} />
                                <div style={{ padding: "3px 5px 4px" }}>
                                  <div style={{ height: 3.5, width: "70%", borderRadius: 2, backgroundColor: `${text}55` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {tpl.layoutType === "sidebar" && (
                        <div style={{ display: "flex", gap: 4, height: 90 }}>
                          <div style={{ width: 28, backgroundColor: tpl.primaryColor, borderRadius: cardR, display: "flex", flexDirection: "column", gap: 3, padding: "4px 3px" }}>
                            {[1, 2, 3].map((i) => (
                              <div key={i} style={{ height: 14, borderRadius: 3, backgroundColor: i === 1 ? `${tpl.accentColor}55` : "rgba(255,255,255,0.12)" }} />
                            ))}
                          </div>
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                            {[1, 2].map((i) => (
                              <div key={i} style={{ display: "flex", gap: 4, height: 26, borderRadius: cardR, backgroundColor: card, padding: "3px 4px", alignItems: "center" }}>
                                <div style={{ width: 18, height: 18, borderRadius: 3, backgroundColor: imgBg, flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                  <div style={{ height: 4, width: "70%", borderRadius: 2, backgroundColor: `${text}55`, marginBottom: 2 }} />
                                  <div style={{ height: 3, width: "40%", borderRadius: 2, backgroundColor: tpl.accentColor }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {tpl.layoutType === "accordion" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <div style={{ borderRadius: cardR, overflow: "hidden", border: `1px solid ${tpl.primaryColor}` }}>
                            <div style={{ backgroundColor: tpl.primaryColor, padding: "4px 7px", display: "flex", justifyContent: "space-between" }}>
                              <div style={{ height: 4, width: 40, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.7)" }} />
                              <div style={{ width: 6, height: 6, borderRadius: 1, backgroundColor: "rgba(255,255,255,0.4)" }} />
                            </div>
                            <div style={{ backgroundColor: card, padding: "3px 5px" }}>
                              {[1, 2].map((i) => (
                                <div key={i} style={{ display: "flex", gap: 4, padding: "3px 0", borderTop: i > 1 ? `1px solid ${text}10` : "none" }}>
                                  <div style={{ width: 14, height: 14, borderRadius: 2, backgroundColor: imgBg, flexShrink: 0 }} />
                                  <div style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: `${text}44`, marginTop: 4 }} />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div style={{ borderRadius: cardR, padding: "4px 7px", backgroundColor: card, border: `1px solid ${text}12` }}>
                            <div style={{ height: 4, width: 36, borderRadius: 2, backgroundColor: `${text}44` }} />
                          </div>
                        </div>
                      )}

                      {tpl.layoutType === "bento" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                          <div style={{ gridColumn: "span 2", borderRadius: cardR, overflow: "hidden", backgroundColor: card, display: "flex", height: 32 }}>
                            <div style={{ width: 32, backgroundColor: imgBg, flexShrink: 0 }} />
                            <div style={{ padding: "4px 6px", flex: 1 }}>
                              <div style={{ height: 4, width: "60%", borderRadius: 2, backgroundColor: `${text}55`, marginBottom: 3 }} />
                              <div style={{ height: 3, width: "35%", borderRadius: 2, backgroundColor: tpl.accentColor }} />
                            </div>
                          </div>
                          {[1, 2].map((i) => (
                            <div key={i} style={{ borderRadius: cardR, overflow: "hidden", backgroundColor: card }}>
                              <div style={{ height: 22, backgroundColor: imgBg }} />
                              <div style={{ padding: "3px 4px" }}>
                                <div style={{ height: 3, width: "75%", borderRadius: 2, backgroundColor: `${text}44` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {tpl.layoutType === "retro" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "2px 0" }}>
                          {[1, 2, 3].map((i) => (
                            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                              <div style={{ height: 4, width: 28, borderRadius: 1, backgroundColor: `${text}66`, flexShrink: 0 }} />
                              <div style={{ flex: 1, borderBottom: `1px dotted ${tpl.accentColor}88`, marginBottom: 2 }} />
                              <div style={{ height: 4, width: 18, borderRadius: 1, backgroundColor: tpl.accentColor, flexShrink: 0 }} />
                            </div>
                          ))}
                        </div>
                      )}

                      {tpl.layoutType === "tiles" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          {[1, 2].map((i) => (
                            <div key={i} style={{ borderRadius: cardR, overflow: "hidden", height: 38, position: "relative", backgroundColor: imgBg }}>
                              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${tpl.primaryColor}cc, transparent)` }} />
                              <div style={{ position: "absolute", bottom: 4, right: 6, left: 6, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                <div style={{ height: 4, width: 40, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.8)" }} />
                                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: tpl.accentColor }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedTemplateKey === tpl.templateKey && (
                      <div className="absolute top-2 inset-s-2">
                        <CheckCircle className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                    )}
                  </div>

                  {/* ── Info footer ── */}
                  <div className="p-4 bg-card border-t border-border">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex shrink-0">
                          <div className="w-4 h-4 rounded-full shadow-sm border border-black/10" style={{ backgroundColor: tpl.primaryColor }} />
                          <div className="w-4 h-4 rounded-full shadow-sm border border-black/10 -ms-1.5" style={{ backgroundColor: tpl.accentColor }} />
                        </div>
                        <h3 className="font-bold text-sm">{tpl.name}</h3>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">{layoutLabel}</span>
                        {tpl.darkMode && <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">تاریک</span>}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{tpl.description}</p>
                    <div className="flex gap-2 mt-2 items-center">
                      <span className="text-[10px] text-muted-foreground/60">{headerLabel}</span>
                      <span className="text-muted-foreground/30 text-xs">·</span>
                      <span className="text-[10px] text-muted-foreground/60">{tabLabel}</span>
                      <span className="text-muted-foreground/30 text-xs">·</span>
                      <span className="text-[10px] text-muted-foreground/60">{radiusLabel}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ── Menu Builder ──── */}
        <TabsContent value="menu" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Categories Sidebar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  دسته‌بندی‌ها
                </h2>
                <Button size="sm" variant="ghost" onClick={openNewCategory} aria-label="دسته‌بندی جدید">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex lg:flex-col gap-2 overflow-x-auto pb-1 lg:overflow-visible lg:pb-0 -mx-1 px-1">
              {categories.length === 0 ? (
                <Card className="border-dashed min-w-[200px] lg:min-w-0">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      دسته‌بندی اضافه کنید
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 gap-1"
                      onClick={openNewCategory}
                    >
                      <Plus className="w-4 h-4" />
                      دسته‌بندی جدید
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => setActiveCategoryId(cat._id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors shrink-0 min-w-[140px] lg:min-w-0 lg:shrink ${
                      activeCategoryId === cat._id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    <span className="text-sm font-medium truncate flex items-center gap-1.5">
                      <CategoryIcon icon={cat.icon} size={16} />
                      {cat.name}
                    </span>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditCategory(cat);
                        }}
                        className="opacity-60 hover:opacity-100 p-1 rounded"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCategory(cat._id);
                        }}
                        className="opacity-60 hover:opacity-100 p-1 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
              </div>
            </div>

            {/* Items Grid */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-semibold">
                  {categories.find((c) => c._id === activeCategoryId)?.name ||
                    "آیتم‌ها"}
                  <Badge variant="secondary" className="ms-2 text-xs">
                    {activeItems.length}
                  </Badge>
                </h2>
                {activeCategoryId && (
                  <Button size="sm" onClick={openNewItem} className="gap-1 w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    آیتم جدید
                  </Button>
                )}
              </div>

              {activeItems.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <UtensilsCrossed className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">
                      {activeCategoryId
                        ? "آیتمی در این دسته‌بندی وجود ندارد"
                        : "ابتدا یک دسته‌بندی انتخاب کنید"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeItems.map((item) => (
                    <Card key={item._id} className={!item.available ? "opacity-60" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex gap-3">
                            {item.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-14 h-14 rounded-lg object-cover shrink-0 border border-border"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <UtensilsCrossed className="w-7 h-7 text-muted-foreground/50" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-sm">{item.name}</p>
                              {item.description && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {item.description}
                                </p>
                              )}
                              <p className="text-sm font-bold text-primary mt-1">
                                {formatToman(item.price)}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditItem(item)}
                              className="h-7 w-7 p-0"
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteItem(item._id)}
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <button
                            onClick={() => toggleAvailability(item)}
                            className={`text-xs px-2 py-1 rounded-full transition-colors ${
                              item.available
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {item.available ? "موجود" : "ناموجود"}
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>نام دسته‌بندی *</Label>
              <Input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="مثال: نوشیدنی گرم"
                autoFocus
              />
            </div>
            <IconPicker
              value={categoryIcon}
              onChange={setCategoryIcon}
              label="آیکون دسته‌بندی"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCategoryDialog(false)}
              >
                لغو
              </Button>
              <Button className="flex-1" onClick={saveCategory} disabled={loading}>
                {loading ? "در حال ذخیره..." : "ذخیره"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Dialog */}
      <Dialog open={itemDialog} onOpenChange={setItemDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "ویرایش آیتم" : "آیتم جدید"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>نام آیتم *</Label>
              <Input
                value={itemForm.name}
                onChange={(e) => setItemForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="مثال: اسپرسو دوبل"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label>توضیحات</Label>
              <Textarea
                value={itemForm.description}
                onChange={(e) =>
                  setItemForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="توضیح مختصر درباره این آیتم..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>قیمت (تومان) *</Label>
              <Input
                type="text"
                inputMode="numeric"
                value={itemForm.price}
                onChange={(e) =>
                  setItemForm((f) => ({
                    ...f,
                    price: formatPriceInput(e.target.value),
                  }))
                }
                placeholder="۵۰٬۰۰۰"
                dir="ltr"
                className="text-left tabular-nums"
              />
            </div>
            <div className="space-y-2">
              <Label>تصویر آیتم</Label>
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  if (!uploadingImage) setIsImageDragging(true);
                }}
                onDragLeave={() => setIsImageDragging(false)}
                onDrop={handleImageDrop}
                className={`rounded-xl border-2 border-dashed p-3 transition-colors ${
                  isImageDragging
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/30"
                }`}
              >
                <Input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={uploadingImage}
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleImageUpload(file);
                    e.target.value = "";
                  }}
                />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border bg-background sm:h-28 sm:w-32 sm:shrink-0">
                    {itemForm.imageUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={itemForm.imageUrl}
                          alt="پیش‌نمایش تصویر آیتم"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setItemForm((f) => ({ ...f, imageUrl: "" }))}
                          className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background"
                          aria-label="حذف تصویر"
                          disabled={uploadingImage}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-3 text-center text-muted-foreground">
                        <UtensilsCrossed className="h-8 w-8 opacity-50" />
                        <span className="block text-xs leading-5">
                          هنوز تصویری انتخاب نشده
                        </span>
                      </div>
                    )}
                    {uploadingImage && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 text-sm font-medium text-foreground backdrop-blur-sm">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <span>در حال آپلود</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        تصویر غذا یا نوشیدنی را اینجا بکشید
                      </p>
                      <p className="text-xs text-muted-foreground">
                        یا از دکمه انتخاب تصویر استفاده کنید. JPG، PNG، WebP یا GIF تا
                        ۵ مگابایت پذیرفته می‌شود.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={uploadingImage}
                      >
                        {itemForm.imageUrl ? "تغییر تصویر" : "انتخاب تصویر"}
                      </Button>
                      {itemForm.imageUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setItemForm((f) => ({ ...f, imageUrl: "" }))}
                          disabled={uploadingImage}
                        >
                          حذف تصویر
                        </Button>
                      )}
                    </div>
                    <p className="min-h-4 text-xs text-muted-foreground">
                      {uploadingImage
                        ? `${imageUploadName || "تصویر"} در حال آپلود است...`
                        : itemForm.imageUrl
                          ? "تصویر آماده است و همراه آیتم ذخیره می‌شود."
                          : "تصویر اختیاری است، اما به جذاب‌تر شدن منو کمک می‌کند."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={itemForm.available}
                onChange={(e) =>
                  setItemForm((f) => ({ ...f, available: e.target.checked }))
                }
              />
              <Label htmlFor="available" className="cursor-pointer">
                موجود است
              </Label>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setItemDialog(false)}
              >
                لغو
              </Button>
              <Button
                className="flex-1"
                onClick={saveItem}
                disabled={loading || uploadingImage}
              >
                {loading ? "در حال ذخیره..." : "ذخیره"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
