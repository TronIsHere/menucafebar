"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart";
import TableCartLabel from "@/components/menu/TableCartLabel";
import MenuItemImage from "@/components/menu/MenuItemImage";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { Minus, Plus, UtensilsCrossed, ShoppingBag } from "@/lib/icons/app-icons";
import type { TemplateProps } from "./types";
import { cafeHoursLabel, fmt } from "./types";

export default function BentoTemplate({ cafe, categories, items, template }: TemplateProps) {
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

  function ItemTile({ item, featured }: { item: (typeof catItems)[0]; featured?: boolean }) {
    const qty = getQty(item._id);
    return (
      <div style={{
        gridColumn: featured ? "span 2" : "span 1",
        backgroundColor: cardBg, borderRadius: 24, overflow: "hidden",
        boxShadow: featured ? "0 8px 24px rgba(0,0,0,0.08)" : "0 4px 16px rgba(0,0,0,0.05)",
        border: `1px solid ${textColor}08`,
        display: "flex", flexDirection: featured ? "row" : "column",
        minHeight: featured ? 140 : 0,
        position: "relative",
      }}>
        {featured && (
          <div style={{
            position: "absolute", top: 12, right: 12, zIndex: 2,
            backgroundColor: accentColor, color: primaryColor,
            padding: "4px 10px", borderRadius: 99, fontSize: 10, fontWeight: 900,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}>
            ویژه
          </div>
        )}
        <MenuItemImage
          imageUrl={item.imageUrl}
          alt={item.name}
          style={{
            width: featured ? 140 : "100%",
            height: featured ? "auto" : 110,
            flexShrink: 0,
            alignSelf: featured ? "stretch" : undefined,
            backgroundColor: `${primaryColor}10`,
          }}
          iconSize={featured ? 44 : 32}
          iconColor={`${primaryColor}25`}
        />
        <div style={{ padding: featured ? "16px 20px" : "12px 14px 14px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: featured ? 18 : 14, fontWeight: 900, margin: "0 0 6px", lineHeight: 1.3, color: textColor }}>{item.name}</p>
            {featured && item.description && (
              <p style={{ fontSize: 12, margin: 0, color: muted, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {item.description}
              </p>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <span style={{ fontSize: featured ? 16 : 13, fontWeight: 900, color: accentColor }}>{fmt(item.price)}</span>
            {qty === 0 ? (
              <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                width: featured ? 36 : 30, height: featured ? 36 : 30, borderRadius: 10,
                backgroundColor: primaryColor, color: "#fff", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 12px ${primaryColor}30`,
              }}>
                <Plus style={{ width: featured ? 16 : 14, height: featured ? 16 : 14 }} />
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 6, backgroundColor: `${primaryColor}10`, padding: "4px", borderRadius: 10 }}>
                <button onClick={() => updateQuantity(item._id, qty - 1)} style={{
                  width: featured ? 26 : 22, height: featured ? 26 : 22, borderRadius: 6, backgroundColor: cardBg,
                  color: primaryColor, border: `1px solid ${primaryColor}20`, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Minus style={{ width: 12, height: 12 }} />
                </button>
                <span style={{ fontWeight: 800, fontSize: 13, minWidth: 16, textAlign: "center", color: textColor }}>{qty}</span>
                <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                  width: featured ? 26 : 22, height: featured ? 26 : 22, borderRadius: 6, backgroundColor: primaryColor,
                  color: "#fff", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Plus style={{ width: 12, height: 12 }} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: bgColor, color: textColor }}>

      {/* Bento-style header with color blocks */}
      <header style={{ padding: "20px 16px 0" }}>
        <div style={{
          backgroundColor: primaryColor, borderRadius: 20, padding: "20px 22px",
          color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        }}>
          <div>
            <p style={{ fontSize: 10, opacity: 0.55, margin: "0 0 4px", letterSpacing: "0.1em" }}>MENU</p>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>{cafe.name}</h1>
          </div>
          <div style={{
            backgroundColor: accentColor, borderRadius: 12, padding: "8px 12px",
            fontSize: 10, fontWeight: 700, color: primaryColor,
          }}>
            {cafeHoursLabel(cafe)}
          </div>
        </div>
      </header>

      {/* Horizontal category blocks */}
      <div style={{ padding: "12px 16px", overflowX: "auto", scrollbarWidth: "none" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {categories.map((cat) => {
            const active = cat._id === activeCatId;
            return (
              <button key={cat._id} onClick={() => setActiveCatId(cat._id)} style={{
                flexShrink: 0, padding: "10px 16px", borderRadius: 14,
                backgroundColor: active ? accentColor : cardBg,
                color: active ? primaryColor : textColor,
                border: `2px solid ${active ? accentColor : `${textColor}10`}`,
                fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                boxShadow: active ? `0 2px 10px ${accentColor}44` : "0 1px 4px rgba(0,0,0,0.05)",
              }}>
                <CategoryIcon icon={cat.icon} size={14} style={{ marginLeft: 6 }} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Asymmetric bento grid */}
      <main style={{ padding: "0 16px 120px" }}>
        {catItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: muted }}>
            <UtensilsCrossed style={{ width: 32, height: 32, margin: "0 auto 10px", opacity: 0.35 }} />
            <p style={{ margin: 0, fontSize: 13 }}>آیتمی موجود نیست</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {catItems.map((item, idx) => (
              <ItemTile key={item._id} item={item} featured={idx === 0} />
            ))}
          </div>
        )}
      </main>

      {cartCount > 0 && (
        <div style={{ position: "fixed", bottom: 20, left: 16, right: 16, zIndex: 30 }}>
          <TableCartLabel tableNumber={tableNumber} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, marginBottom: 8, color: textColor, opacity: 0.85 }} />
          <button onClick={() => router.push(`/${cafe.slug}/checkout`)} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 20px", borderRadius: 16,
            backgroundColor: primaryColor, color: "#fff", border: "none", cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)", fontSize: 14, fontWeight: 700,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ backgroundColor: accentColor, color: primaryColor, borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900 }}>{cartCount}</span>
              <ShoppingBag style={{ width: 16, height: 16 }} />
              سبد سفارش
            </span>
            <span style={{ color: accentColor }}>{fmt(cartTotal)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
