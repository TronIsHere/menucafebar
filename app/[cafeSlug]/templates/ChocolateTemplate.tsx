"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart";
import TableCartLabel from "@/components/menu/TableCartLabel";
import MenuItemImage from "@/components/menu/MenuItemImage";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { Minus, Plus, MapPin, Clock, UtensilsCrossed } from "@/lib/icons/app-icons";
import type { TemplateProps } from "./types";
import { fmt } from "./types";

export default function ChocolateTemplate({ cafe, categories, items, template }: TemplateProps) {
  const router = useRouter();
  const { items: cartItems, addItem, updateQuantity, setSlug, total, tableNumber } = useCartStore();
  const [activeCatId, setActiveCatId] = useState(categories[0]?._id ?? "");

  const { primaryColor, accentColor, bgColor, cardBg, textColor } = template;
  const muted = `${textColor}60`;
  const dividerColor = `${accentColor}25`;

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = total();

  useEffect(() => { setSlug(cafe.slug); }, [cafe.slug, setSlug]);

  const getQty = (id: string) => cartItems.find((i) => i.menuItemId === id)?.quantity ?? 0;
  const catItems = items.filter((i) => i.categoryId === activeCatId);

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: bgColor, color: textColor }}>

      {/* Luxury full dark hero */}
      <header style={{
        background: `linear-gradient(170deg, ${primaryColor} 0%, ${bgColor} 100%)`,
        color: textColor, textAlign: "center",
        padding: "48px 24px 36px",
        borderBottom: `1px solid ${accentColor}20`,
      }}>
        <p style={{ fontSize: 9, letterSpacing: "0.35em", color: accentColor, margin: "0 0 16px", textTransform: "uppercase" }}>
          {cafe.city}
        </p>
        <h1 style={{
          fontSize: 36, fontWeight: 900, margin: 0, letterSpacing: "-0.01em",
          lineHeight: 1.1, color: textColor,
        }}>
          {cafe.name}
        </h1>
        {/* Gold ornamental divider */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: "20px 0" }}>
          <div style={{ width: 40, height: 1, backgroundColor: accentColor, opacity: 0.6 }} />
          <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: accentColor }} />
          <div style={{ width: 40, height: 1, backgroundColor: accentColor, opacity: 0.6 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, fontSize: 11, color: muted }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <MapPin style={{ width: 10, height: 10 }} />{cafe.address}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Clock style={{ width: 10, height: 10 }} />{cafe.openTime}–{cafe.closeTime}
          </span>
        </div>
      </header>

      {/* Uppercase minimal category nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 10,
        backgroundColor: bgColor,
        borderBottom: `1px solid ${accentColor}18`,
        overflowX: "auto", scrollbarWidth: "none",
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
      }}>
        <div style={{ display: "flex", maxWidth: 680, margin: "0 auto", padding: "0 24px" }}>
          {categories.map((cat) => {
            const active = cat._id === activeCatId;
            return (
              <button key={cat._id} onClick={() => setActiveCatId(cat._id)} style={{
                flexShrink: 0, padding: "18px 20px 16px",
                fontSize: 11, fontWeight: active ? 700 : 500,
                letterSpacing: "0.12em",
                color: active ? accentColor : muted,
                background: "none", border: "none",
                borderBottom: `2px solid ${active ? accentColor : "transparent"}`,
                cursor: "pointer", whiteSpace: "nowrap",
                textTransform: "uppercase", transition: "all 0.15s",
              }}>
                <CategoryIcon icon={cat.icon} size={14} style={{ marginLeft: 5 }} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Luxury line items — no cards, editorial rows */}
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "8px 24px 140px" }}>
        {catItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: muted }}>
            <UtensilsCrossed style={{ width: 36, height: 36, margin: "0 auto 14px", opacity: 0.25, color: textColor }} />
            <p style={{ margin: 0, fontSize: 14 }}>آیتمی موجود نیست</p>
          </div>
        ) : catItems.map((item, idx) => {
          const qty = getQty(item._id);
          return (
            <div key={item._id}>
              <div style={{ display: "flex", gap: 20, padding: "28px 0", alignItems: "center" }}>
                <MenuItemImage
                  imageUrl={item.imageUrl}
                  alt={item.name}
                  style={{
                    width: 110,
                    height: 110,
                    flexShrink: 0,
                    border: `1px solid ${accentColor}25`,
                    backgroundColor: `${accentColor}06`,
                  }}
                  iconSize={28}
                  iconColor={`${accentColor}30`}
                />

                {/* Name + description */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 16, fontWeight: 700, margin: "0 0 5px",
                    color: textColor, letterSpacing: "0.01em",
                  }}>
                    {item.name}
                  </p>
                  {item.description && (
                    <p style={{ fontSize: 12, margin: 0, color: muted, lineHeight: 1.7 }}>
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Price + qty */}
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: accentColor, letterSpacing: "0.02em" }}>
                    {fmt(item.price)}
                  </span>
                  {qty === 0 ? (
                    <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                      padding: "6px 16px",
                      border: `1px solid ${accentColor}50`,
                      backgroundColor: "transparent", color: accentColor,
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 4,
                      letterSpacing: "0.05em",
                    }}>
                      <Plus style={{ width: 11, height: 11 }} />
                      افزودن
                    </button>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button onClick={() => updateQuantity(item._id, qty - 1)} style={{
                        width: 28, height: 28,
                        border: `1px solid ${accentColor}40`,
                        backgroundColor: "transparent", color: accentColor,
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Minus style={{ width: 11, height: 11 }} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: 15, color: accentColor, minWidth: 24, textAlign: "center" }}>{qty}</span>
                      <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                        width: 28, height: 28,
                        border: `1px solid ${accentColor}`,
                        backgroundColor: `${accentColor}15`, color: accentColor,
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Plus style={{ width: 11, height: 11 }} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Gold ornamental divider */}
              {idx < catItems.length - 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 1, backgroundColor: dividerColor }} />
                  <div style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: `${accentColor}50` }} />
                  <div style={{ flex: 1, height: 1, backgroundColor: dividerColor }} />
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* Gold-outlined luxury cart bar */}
      {cartCount > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30,
          backgroundColor: bgColor,
          borderTop: `1px solid ${accentColor}25`,
          boxShadow: "0 -4px 24px rgba(0,0,0,0.5)",
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
              width: "100%", padding: "15px 24px",
              border: `1px solid ${accentColor}50`,
              backgroundColor: "transparent", color: textColor,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
              fontSize: 13, fontWeight: 700, letterSpacing: "0.05em",
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  border: `1px solid ${accentColor}60`, color: accentColor,
                  width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800,
                }}>{cartCount}</span>
                <span style={{ letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 12 }}>
                  مشاهده سبد سفارش
                </span>
              </span>
              <span style={{ color: accentColor, fontWeight: 900 }}>{fmt(cartTotal)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
