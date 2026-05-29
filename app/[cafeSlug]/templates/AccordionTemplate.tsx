"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart";
import TableCartLabel from "@/components/menu/TableCartLabel";
import MenuItemImage from "@/components/menu/MenuItemImage";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { Minus, Plus, ChevronDown, MapPin, Clock, UtensilsCrossed, ShoppingBag } from "@/lib/icons/app-icons";
import type { TemplateProps } from "./types";
import { fmt } from "./types";

export default function AccordionTemplate({ cafe, categories, items, template }: TemplateProps) {
  const router = useRouter();
  const { items: cartItems, addItem, updateQuantity, setSlug, total, tableNumber } = useCartStore();
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(categories[0]?._id ? [categories[0]._id] : []));

  const { primaryColor, accentColor, bgColor, cardBg, textColor } = template;
  const muted = `${textColor}55`;

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = total();

  useEffect(() => { setSlug(cafe.slug); }, [cafe.slug, setSlug]);

  const getQty = (id: string) => cartItems.find((i) => i.menuItemId === id)?.quantity ?? 0;

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: bgColor, color: textColor }}>

      {/* Simple header */}
      <header style={{ padding: "28px 20px 20px", textAlign: "center", borderBottom: `2px solid ${accentColor}30` }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, color: primaryColor }}>{cafe.name}</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8, fontSize: 11, color: muted }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin style={{ width: 10, height: 10 }} />{cafe.city}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock style={{ width: 10, height: 10 }} />{cafe.openTime}–{cafe.closeTime}
          </span>
        </div>
      </header>

      {/* Accordion sections */}
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 120px" }}>
        {categories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: muted }}>
            <UtensilsCrossed style={{ width: 36, height: 36, margin: "0 auto 12px", opacity: 0.3 }} />
            <p style={{ margin: 0, fontSize: 14 }}>دسته‌بندی موجود نیست</p>
          </div>
        ) : categories.map((cat) => {
          const open = openIds.has(cat._id);
          const catItems = items.filter((i) => i.categoryId === cat._id);
          return (
            <div key={cat._id} style={{ marginBottom: 12, borderRadius: 16, overflow: "hidden", boxShadow: open ? "0 8px 24px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)", transition: "all 0.3s ease" }}>
              <button onClick={() => toggle(cat._id)} style={{
                width: "100%", padding: "18px 20px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                backgroundColor: open ? primaryColor : cardBg,
                color: open ? "#fff" : textColor,
                border: "none",
                cursor: "pointer", transition: "all 0.3s ease",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    backgroundColor: open ? "rgba(255,255,255,0.15)" : `${primaryColor}10`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, transition: "all 0.3s ease",
                  }}>
                    <CategoryIcon icon={cat.icon} size={20} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em" }}>{cat.name}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: open ? "rgba(255,255,255,0.7)" : muted,
                    }}>
                      {catItems.length} آیتم
                    </span>
                  </div>
                </div>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  backgroundColor: open ? "rgba(255,255,255,0.1)" : `${textColor}08`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "all 0.3s ease",
                }}>
                  <ChevronDown style={{ width: 18, height: 18, opacity: open ? 1 : 0.6 }} />
                </div>
              </button>

              <div style={{
                display: "grid",
                gridTemplateRows: open ? "1fr" : "0fr",
                transition: "grid-template-rows 0.3s ease-in-out",
                backgroundColor: cardBg,
              }}>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ padding: open ? "8px 0" : "0" }}>
                    {catItems.length === 0 ? (
                      <p style={{ padding: "24px 20px", margin: 0, fontSize: 14, color: muted, textAlign: "center" }}>آیتمی موجود نیست</p>
                    ) : catItems.map((item, idx) => {
                      const qty = getQty(item._id);
                      return (
                        <div key={item._id} style={{
                          display: "flex", gap: 16, padding: "16px 20px", alignItems: "center",
                          borderTop: idx > 0 ? `1px solid ${textColor}08` : "none",
                        }}>
                          <MenuItemImage
                            imageUrl={item.imageUrl}
                            alt={item.name}
                            style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 12, backgroundColor: `${primaryColor}08` }}
                            iconSize={24}
                            iconColor={`${primaryColor}20`}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px", color: textColor }}>{item.name}</p>
                            {item.description && (
                              <p style={{ fontSize: 12, margin: 0, color: muted, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                            <span style={{ fontSize: 14, fontWeight: 900, color: accentColor }}>{fmt(item.price)}</span>
                            {qty === 0 ? (
                              <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                                padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                                backgroundColor: `${primaryColor}10`, color: primaryColor,
                                border: "none", cursor: "pointer", transition: "background 0.2s",
                              }}>
                                + افزودن
                              </button>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <button onClick={() => updateQuantity(item._id, qty - 1)} style={{
                                  width: 28, height: 28, borderRadius: 6, backgroundColor: `${primaryColor}15`,
                                  color: primaryColor, border: "none", cursor: "pointer",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                  <Minus style={{ width: 12, height: 12 }} />
                                </button>
                                <span style={{ fontWeight: 800, fontSize: 14, minWidth: 16, textAlign: "center", color: textColor }}>{qty}</span>
                                <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                                  width: 28, height: 28, borderRadius: 6, backgroundColor: primaryColor,
                                  color: "#fff", border: "none", cursor: "pointer",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                  <Plus style={{ width: 12, height: 12 }} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {cartCount > 0 && (
        <div style={{ position: "fixed", bottom: 20, left: 16, right: 16, zIndex: 30 }}>
          <TableCartLabel tableNumber={tableNumber} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, marginBottom: 8, color: textColor, opacity: 0.85 }} />
          <button onClick={() => router.push(`/${cafe.slug}/checkout`)} style={{
            width: "100%", maxWidth: 608, margin: "0 auto", display: "flex",
            alignItems: "center", justifyContent: "space-between",
            padding: "14px 20px", borderRadius: 12,
            backgroundColor: primaryColor, color: "#fff", border: "none", cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.18)", fontSize: 14, fontWeight: 700,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShoppingBag style={{ width: 16, height: 16 }} />
              سبد ({cartCount} آیتم)
            </span>
            <span style={{ color: accentColor }}>{fmt(cartTotal)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
