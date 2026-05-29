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

export default function TilesTemplate({ cafe, categories, items, template }: TemplateProps) {
  const router = useRouter();
  const { items: cartItems, addItem, updateQuantity, setSlug, total, tableNumber } = useCartStore();
  const [activeCatId, setActiveCatId] = useState(categories[0]?._id ?? "");

  const { primaryColor, accentColor, bgColor, textColor } = template;
  const muted = `${textColor}55`;

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = total();

  useEffect(() => { setSlug(cafe.slug); }, [cafe.slug, setSlug]);

  const getQty = (id: string) => cartItems.find((i) => i.menuItemId === id)?.quantity ?? 0;
  const catItems = items.filter((i) => i.categoryId === activeCatId);

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: bgColor, color: textColor }}>

      {/* Overlay header on dark strip */}
      <header style={{
        backgroundColor: primaryColor, color: "#fff",
        padding: "16px 20px 48px",
        position: "relative",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>{cafe.name}</h1>
          <span style={{ fontSize: 11, opacity: 0.65, display: "flex", alignItems: "center", gap: 4 }}>
            <Clock style={{ width: 11, height: 11 }} />
            {cafe.openTime}–{cafe.closeTime}
          </span>
        </div>
      </header>

      {/* Floating category pills overlapping header */}
      <div style={{ margin: "-28px 16px 16px", position: "relative", zIndex: 5 }}>
        <div style={{
          display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none",
          backgroundColor: bgColor, borderRadius: 16, padding: "10px 12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        }}>
          {categories.map((cat) => {
            const active = cat._id === activeCatId;
            return (
              <button key={cat._id} onClick={() => setActiveCatId(cat._id)} style={{
                flexShrink: 0, padding: "8px 16px", borderRadius: 999,
                backgroundColor: active ? primaryColor : "transparent",
                color: active ? "#fff" : textColor,
                border: active ? "none" : `1.5px solid ${textColor}15`,
                fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
              }}>
                <CategoryIcon icon={cat.icon} size={14} style={{ marginLeft: 5 }} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Full-width image tiles */}
      <main style={{ padding: "0 16px 120px" }}>
        {catItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: muted }}>
            <UtensilsCrossed style={{ width: 36, height: 36, margin: "0 auto 12px", opacity: 0.3 }} />
            <p style={{ margin: 0, fontSize: 14 }}>آیتمی موجود نیست</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {catItems.map((item) => {
              const qty = getQty(item._id);
              return (
                <div key={item._id} style={{
                  position: "relative", borderRadius: 24, overflow: "hidden",
                  height: 220, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  transform: "translateZ(0)", // Force hardware acceleration
                }}>
                  {/* Background image */}
                  <MenuItemImage
                    imageUrl={item.imageUrl}
                    alt={item.name}
                    style={{
                      position: "absolute", inset: 0, width: "100%", height: "100%",
                      backgroundColor: `${primaryColor}20`,
                      transition: "transform 0.4s ease",
                    }}
                    iconSize={48}
                    iconColor={`${primaryColor}40`}
                  />

                  {/* Gradient overlay */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(to top, ${primaryColor} 0%, ${primaryColor}dd 30%, ${primaryColor}66 60%, transparent 100%)`,
                  }} />

                  {/* Content overlay */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "20px", color: "#fff",
                    display: "flex", justifyContent: "space-between", alignItems: "flex-end",
                  }}>
                    <div style={{ flex: 1, minWidth: 0, paddingLeft: 16 }}>
                      <p style={{ fontSize: 20, fontWeight: 900, margin: "0 0 6px", lineHeight: 1.2, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{item.name}</p>
                      {item.description && (
                        <p style={{ fontSize: 12, margin: 0, opacity: 0.85, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
                          {item.description}
                        </p>
                      )}
                      <p style={{ fontSize: 16, fontWeight: 900, color: accentColor, margin: "10px 0 0", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{fmt(item.price)}</p>
                    </div>

                    {qty === 0 ? (
                      <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                        width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                        backgroundColor: accentColor, color: primaryColor,
                        border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 4px 16px ${accentColor}66`, transition: "transform 0.2s",
                      }}>
                        <Plus style={{ width: 22, height: 22 }} />
                      </button>
                    ) : (
                      <div style={{
                        display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
                        backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)",
                        borderRadius: 999, padding: "6px 14px", border: "1px solid rgba(255,255,255,0.3)",
                      }}>
                        <button onClick={() => updateQuantity(item._id, qty - 1)} style={{
                          width: 32, height: 32, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.25)",
                          color: "#fff", border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Minus style={{ width: 14, height: 14 }} />
                        </button>
                        <span style={{ fontWeight: 900, fontSize: 16, minWidth: 20, textAlign: "center", textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>{qty}</span>
                        <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                          width: 32, height: 32, borderRadius: "50%", backgroundColor: accentColor,
                          color: primaryColor, border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Plus style={{ width: 14, height: 14 }} />
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

      {cartCount > 0 && (
        <div style={{ position: "fixed", bottom: 20, left: 16, right: 16, zIndex: 30 }}>
          <TableCartLabel tableNumber={tableNumber} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, marginBottom: 8, color: textColor, opacity: 0.85 }} />
          <button onClick={() => router.push(`/${cafe.slug}/checkout`)} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "15px 22px", borderRadius: 999,
            backgroundColor: primaryColor, color: "#fff", border: "none", cursor: "pointer",
            boxShadow: "0 6px 24px rgba(0,0,0,0.25)", fontSize: 14, fontWeight: 700,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                backgroundColor: accentColor, color: primaryColor, borderRadius: 999,
                width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 900,
              }}>{cartCount}</span>
              <ShoppingBag style={{ width: 16, height: 16 }} />
              مشاهده سبد
            </span>
            <span style={{ color: accentColor, fontWeight: 900 }}>{fmt(cartTotal)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
