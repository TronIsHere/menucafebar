"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart";
import TableCartLabel from "@/components/menu/TableCartLabel";
import MenuItemImage from "@/components/menu/MenuItemImage";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { Minus, Plus, Clock, UtensilsCrossed, ShoppingBag } from "@/lib/icons/app-icons";
import type { TemplateProps } from "./types";
import { fmt } from "./types";

export default function SidebarTemplate({ cafe, categories, items, template }: TemplateProps) {
  const router = useRouter();
  const { items: cartItems, addItem, updateQuantity, setSlug, total, tableNumber } = useCartStore();
  const [activeCatId, setActiveCatId] = useState(categories[0]?._id ?? "");

  const { primaryColor, accentColor, bgColor, cardBg, textColor } = template;
  const muted = `${textColor}55`;

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = total();

  useEffect(() => { setSlug(cafe.slug); }, [cafe.slug, setSlug]);

  const getQty = (id: string) => cartItems.find((i) => i.menuItemId === id)?.quantity ?? 0;
  const catItems = items.filter((i) => i.categoryId === activeCatId);
  const activeCat = categories.find((c) => c._id === activeCatId);

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: bgColor, color: textColor, display: "flex", flexDirection: "column" }}>

      {/* Slim top bar */}
      <header style={{
        backgroundColor: primaryColor, color: "#fff",
        padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{cafe.name}</h1>
          <p style={{ fontSize: 11, opacity: 0.6, margin: "2px 0 0" }}>{cafe.city}</p>
        </div>
        <span style={{ fontSize: 11, opacity: 0.65, display: "flex", alignItems: "center", gap: 4 }}>
          <Clock style={{ width: 11, height: 11 }} />
          {cafe.openTime}–{cafe.closeTime}
        </span>
      </header>

      {/* Split layout: sidebar + main */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

        {/* Vertical category sidebar */}
        <aside style={{
          width: 100, flexShrink: 0,
          backgroundColor: primaryColor,
          overflowY: "auto",
          borderLeft: `1px solid ${accentColor}20`,
          padding: "12px 0",
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          {categories.map((cat) => {
            const active = cat._id === activeCatId;
            const count = items.filter((i) => i.categoryId === cat._id).length;
            return (
              <button key={cat._id} onClick={() => setActiveCatId(cat._id)} style={{
                position: "relative",
                width: "100%", padding: "14px 8px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                background: active ? `linear-gradient(to right, ${accentColor}15, transparent)` : "transparent",
                border: "none",
                cursor: "pointer", transition: "all 0.2s ease",
              }}>
                {active && (
                  <div style={{
                    position: "absolute", right: 0, top: "15%", bottom: "15%", width: 4,
                    backgroundColor: accentColor, borderRadius: "4px 0 0 4px",
                  }} />
                )}
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  backgroundColor: active ? accentColor : "rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, boxShadow: active ? `0 4px 12px ${accentColor}40` : "none",
                  transition: "all 0.2s ease",
                }}>
                  <CategoryIcon icon={cat.icon} size={20} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                  <span style={{
                    fontSize: 11, fontWeight: active ? 800 : 500, lineHeight: 1.3,
                    color: active ? accentColor : "rgba(255,255,255,0.7)",
                    textAlign: "center", maxWidth: 80,
                    overflow: "hidden", textOverflow: "ellipsis",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                  }}>
                    {cat.name}
                  </span>
                  <span style={{
                    fontSize: 9, fontWeight: 700,
                    backgroundColor: active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
                    color: active ? "#fff" : "rgba(255,255,255,0.4)",
                    borderRadius: 99, padding: "2px 6px", minWidth: 20, textAlign: "center",
                  }}>
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "20px 16px 140px", backgroundColor: bgColor }}>
          {activeCat && (
            <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0, color: textColor, letterSpacing: "-0.02em" }}>{activeCat.name}</h2>
                <p style={{ fontSize: 12, color: muted, margin: "4px 0 0" }}>{catItems.length} آیتم در این دسته</p>
              </div>
              <div style={{ width: 40, height: 4, backgroundColor: accentColor, borderRadius: 2, opacity: 0.8 }} />
            </div>
          )}

          {catItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0", color: muted }}>
              <UtensilsCrossed style={{ width: 36, height: 36, margin: "0 auto 12px", opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: 14 }}>آیتمی موجود نیست</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {catItems.map((item) => {
                const qty = getQty(item._id);
                return (
                  <div key={item._id} style={{
                    backgroundColor: cardBg, borderRadius: 16,
                    padding: 14, display: "flex", gap: 14, alignItems: "center",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                    border: `1px solid ${textColor}08`,
                  }}>
                    <MenuItemImage
                      imageUrl={item.imageUrl}
                      alt={item.name}
                      style={{ width: 72, height: 72, flexShrink: 0, borderRadius: 12, backgroundColor: `${primaryColor}08` }}
                      iconSize={28}
                      iconColor={`${primaryColor}25`}
                    />
                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                      <p style={{ fontSize: 15, fontWeight: 800, margin: 0, color: textColor }}>{item.name}</p>
                      {item.description && (
                        <p style={{ fontSize: 12, margin: 0, color: muted, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {item.description}
                        </p>
                      )}
                      <p style={{ fontSize: 14, fontWeight: 900, color: accentColor, margin: "4px 0 0" }}>{fmt(item.price)}</p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {qty === 0 ? (
                        <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                          width: 36, height: 36, borderRadius: 10,
                          backgroundColor: primaryColor, color: "#fff", border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: `0 4px 12px ${primaryColor}30`, transition: "transform 0.1s",
                        }}>
                          <Plus style={{ width: 16, height: 16 }} />
                        </button>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, backgroundColor: `${primaryColor}08`, padding: "4px", borderRadius: 12 }}>
                          <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                            width: 28, height: 28, borderRadius: 8, backgroundColor: primaryColor,
                            color: "#fff", border: "none", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Plus style={{ width: 12, height: 12 }} />
                          </button>
                          <span style={{ fontWeight: 800, fontSize: 13, color: textColor }}>{qty}</span>
                          <button onClick={() => updateQuantity(item._id, qty - 1)} style={{
                            width: 28, height: 28, borderRadius: 8, backgroundColor: cardBg,
                            color: primaryColor, border: `1px solid ${primaryColor}30`, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Minus style={{ width: 12, height: 12 }} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {cartCount > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30, padding: "12px 16px", backgroundColor: `${bgColor}f5`, borderTop: `1px solid ${textColor}10` }}>
          <TableCartLabel tableNumber={tableNumber} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, marginBottom: 8, color: textColor, opacity: 0.85 }} />
          <button onClick={() => router.push(`/${cafe.slug}/checkout`)} style={{
            width: "100%", padding: "13px 20px", borderRadius: 10,
            backgroundColor: primaryColor, color: "#fff", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14, fontWeight: 700,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShoppingBag style={{ width: 16, height: 16 }} />
              سبد ({cartCount})
            </span>
            <span style={{ color: accentColor }}>{fmt(cartTotal)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
