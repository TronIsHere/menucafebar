"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart";
import TableCartLabel from "@/components/menu/TableCartLabel";
import MenuItemImage from "@/components/menu/MenuItemImage";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { Minus, Plus, MapPin, Clock, UtensilsCrossed, ShoppingBag } from "@/lib/icons/app-icons";
import type { TemplateProps } from "./types";
import { fmt } from "./types";

export default function ClassicTemplate({ cafe, categories, items, template }: TemplateProps) {
  const router = useRouter();
  const { items: cartItems, addItem, updateQuantity, setSlug, total, tableNumber } = useCartStore();
  const [activeCatId, setActiveCatId] = useState(categories[0]?._id ?? "");

  const { primaryColor, accentColor, bgColor, textColor } = template;
  const muted = `${textColor}66`;

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = total();

  useEffect(() => { setSlug(cafe.slug); }, [cafe.slug, setSlug]);

  const getQty = (id: string) => cartItems.find((i) => i.menuItemId === id)?.quantity ?? 0;
  const catItems = items.filter((i) => i.categoryId === activeCatId);

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: bgColor, color: textColor }}>

      {/* Centered editorial header */}
      <header style={{ backgroundColor: primaryColor, color: "#fff", textAlign: "center", padding: "36px 24px 28px" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.25em", opacity: 0.6, margin: "0 0 10px", textTransform: "uppercase" }}>
          {cafe.city}
        </p>
        <h1 style={{ fontSize: 34, fontWeight: 900, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          {cafe.name}
        </h1>
        <div style={{ width: 56, height: 2, backgroundColor: accentColor, margin: "18px auto" }} />
        <div style={{ display: "flex", justifyContent: "center", gap: 24, fontSize: 12, opacity: 0.65 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <MapPin style={{ width: 11, height: 11 }} />{cafe.address}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Clock style={{ width: 11, height: 11 }} />{cafe.openTime}–{cafe.closeTime}
          </span>
        </div>
      </header>

      {/* Category nav — book chapter style */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 10,
        backgroundColor: bgColor,
        borderBottom: `1px solid ${textColor}14`,
        overflowX: "auto", scrollbarWidth: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", maxWidth: 680, margin: "0 auto", padding: "0 24px" }}>
          {categories.map((cat) => {
            const active = cat._id === activeCatId;
            return (
              <button key={cat._id} onClick={() => setActiveCatId(cat._id)} style={{
                flexShrink: 0, padding: "18px 20px 16px",
                fontSize: 13, fontWeight: active ? 700 : 500,
                color: active ? primaryColor : muted,
                background: "none", border: "none",
                borderBottom: `2px solid ${active ? accentColor : "transparent"}`,
                cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
              }}>
                <CategoryIcon icon={cat.icon} size={14} style={{ marginLeft: 5 }} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Item list — divider-separated rows, no cards */}
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "8px 24px 140px" }}>
        {catItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "72px 0", color: muted }}>
            <UtensilsCrossed style={{ width: 36, height: 36, margin: "0 auto 12px", opacity: 0.4 }} />
            <p style={{ margin: 0, fontSize: 14 }}>آیتمی موجود نیست</p>
          </div>
        ) : catItems.map((item, idx) => {
          const qty = getQty(item._id);
          return (
            <div key={item._id}>
              <div style={{ display: "flex", gap: 20, padding: "24px 0", alignItems: "center" }}>
                <MenuItemImage
                  imageUrl={item.imageUrl}
                  alt={item.name}
                  style={{
                    width: 110,
                    height: 110,
                    flexShrink: 0,
                    borderRadius: 4,
                    backgroundColor: `${primaryColor}12`,
                  }}
                  iconSize={30}
                  iconColor={`${primaryColor}35`}
                />

                {/* Name + description */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, margin: "0 0 5px", color: textColor }}>{item.name}</p>
                  {item.description && (
                    <p style={{ fontSize: 12, margin: 0, color: muted, lineHeight: 1.7 }}>{item.description}</p>
                  )}
                </div>

                {/* Price + qty — right side */}
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: accentColor }}>{fmt(item.price)}</span>
                  {qty === 0 ? (
                    <button
                      onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })}
                      style={{
                        padding: "6px 18px", borderRadius: 2,
                        border: `1.5px solid ${primaryColor}`,
                        backgroundColor: "transparent", color: primaryColor,
                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      <Plus style={{ width: 11, height: 11, display: "inline", marginLeft: 4 }} />
                      افزودن
                    </button>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => updateQuantity(item._id, qty - 1)} style={{
                        width: 28, height: 28, borderRadius: 2,
                        border: `1.5px solid ${primaryColor}`, backgroundColor: "transparent",
                        color: primaryColor, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Minus style={{ width: 12, height: 12 }} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: 14, color: textColor, minWidth: 24, textAlign: "center" }}>{qty}</span>
                      <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                        width: 28, height: 28, borderRadius: 2,
                        border: `1.5px solid ${primaryColor}`, backgroundColor: primaryColor,
                        color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Plus style={{ width: 12, height: 12 }} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Thin gold divider */}
              {idx < catItems.length - 1 && (
                <div style={{ height: 1, backgroundColor: `${accentColor}22` }} />
              )}
            </div>
          );
        })}
      </main>

      {/* Bottom cart bar — not floating, anchored to bottom */}
      {cartCount > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30,
          backgroundColor: bgColor,
          borderTop: `1px solid ${textColor}12`,
          boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
          padding: "16px 24px",
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <TableCartLabel
              tableNumber={tableNumber}
              style={{
                textAlign: "center",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 10,
                color: textColor,
                opacity: 0.85,
              }}
            />
            <button onClick={() => router.push(`/${cafe.slug}/checkout`)} style={{
              width: "100%", padding: "14px 24px", borderRadius: 2,
              backgroundColor: primaryColor, color: "#fff",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              fontSize: 14, fontWeight: 700,
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ShoppingBag style={{ width: 17, height: 17 }} />
                مشاهده سبد ({cartCount} آیتم)
              </span>
              <span style={{ color: accentColor }}>{fmt(cartTotal)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
