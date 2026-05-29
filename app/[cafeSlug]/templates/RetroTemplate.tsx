"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart";
import TableCartLabel from "@/components/menu/TableCartLabel";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { Minus, Plus, MapPin, Clock, UtensilsCrossed, ShoppingBag } from "@/lib/icons/app-icons";
import type { TemplateProps } from "./types";
import { cafeHoursLabel, fmt } from "./types";

export default function RetroTemplate({ cafe, categories, items, template }: TemplateProps) {
  const router = useRouter();
  const { items: cartItems, addItem, updateQuantity, setSlug, total, tableNumber } = useCartStore();
  const [activeCatId, setActiveCatId] = useState(categories[0]?._id ?? "");

  const { primaryColor, accentColor, bgColor, textColor } = template;
  const muted = `${textColor}70`;
  const paperBg = bgColor;
  const borderColor = `${primaryColor}25`;

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = total();

  useEffect(() => { setSlug(cafe.slug); }, [cafe.slug, setSlug]);

  const getQty = (id: string) => cartItems.find((i) => i.menuItemId === id)?.quantity ?? 0;
  const catItems = items.filter((i) => i.categoryId === activeCatId);
  const activeCat = categories.find((c) => c._id === activeCatId);

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: paperBg, color: textColor }}>

      {/* Vintage menu board header */}
      <header style={{
        padding: "32px 24px 24px", textAlign: "center",
        borderBottom: `3px double ${primaryColor}`,
        background: `repeating-linear-gradient(0deg, transparent, transparent 28px, ${borderColor} 28px, ${borderColor} 29px)`,
      }}>
        <div style={{
          display: "inline-block", padding: "4px 20px",
          border: `2px solid ${primaryColor}`, borderRadius: 2,
          marginBottom: 12,
        }}>
          <span style={{ fontSize: 10, letterSpacing: "0.3em", fontWeight: 700, color: primaryColor }}>★ EST. {cafe.city} ★</span>
        </div>
        <h1 style={{
          fontSize: 32, fontWeight: 900, margin: 0, color: primaryColor,
          fontFamily: "Georgia, 'Times New Roman', serif",
          letterSpacing: "0.02em",
        }}>
          {cafe.name}
        </h1>
        <p style={{ fontSize: 12, color: muted, margin: "10px 0 0", fontStyle: "italic" }}>
          {cafeHoursLabel(cafe, " – ")}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 8, fontSize: 11, color: muted }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin style={{ width: 10, height: 10 }} />{cafe.address}
          </span>
        </div>
      </header>

      {/* Vintage tab strip */}
      <nav style={{
        display: "flex", justifyContent: "center", gap: 0,
        borderBottom: `2px solid ${primaryColor}`,
        overflowX: "auto", scrollbarWidth: "none",
      }}>
        {categories.map((cat) => {
          const active = cat._id === activeCatId;
          return (
            <button key={cat._id} onClick={() => setActiveCatId(cat._id)} style={{
              flexShrink: 0, padding: "10px 22px",
              fontSize: 13, fontWeight: active ? 700 : 500,
              fontFamily: "Georgia, 'Times New Roman', serif",
              color: active ? paperBg : primaryColor,
              backgroundColor: active ? primaryColor : "transparent",
              border: `2px solid ${primaryColor}`,
              borderBottom: active ? `2px solid ${primaryColor}` : "none",
              marginBottom: active ? -2 : 0,
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}>
              <CategoryIcon icon={cat.icon} size={14} style={{ marginLeft: 6 }} />
              {cat.name}
            </button>
          );
        })}
      </nav>

      {/* Dotted-leader menu list */}
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "32px 24px 120px" }}>
        {activeCat && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 32 }}>
            <div style={{ height: 1, flex: 1, backgroundColor: `${primaryColor}40` }} />
            <h2 style={{
              fontSize: 22, fontWeight: 700, margin: 0, textAlign: "center",
              fontFamily: "Georgia, 'Times New Roman', serif",
              color: primaryColor, letterSpacing: "0.05em",
            }}>
              {activeCat.name}
            </h2>
            <div style={{ height: 1, flex: 1, backgroundColor: `${primaryColor}40` }} />
          </div>
        )}

        {catItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: muted }}>
            <UtensilsCrossed style={{ width: 36, height: 36, margin: "0 auto 12px", opacity: 0.3 }} />
            <p style={{ margin: 0, fontSize: 14, fontStyle: "italic", fontFamily: "Georgia, 'Times New Roman', serif" }}>آیتمی موجود نیست</p>
          </div>
        ) : catItems.map((item) => {
          const qty = getQty(item._id);
          return (
            <div key={item._id} style={{ marginBottom: 24 }}>
              {/* Name .... Price row */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{
                  fontSize: 17, fontWeight: 700, flexShrink: 0,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  color: textColor,
                }}>
                  {item.name}
                </span>
                <span style={{
                  flex: 1,
                  borderBottom: `2px dotted ${primaryColor}66`,
                  marginBottom: 5, minWidth: 20, opacity: 0.7,
                }} />
                <span style={{
                  fontSize: 16, fontWeight: 800, color: accentColor, flexShrink: 0,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                }}>
                  {fmt(item.price)}
                </span>
              </div>

              {item.description && (
                <p style={{
                  fontSize: 13, color: muted, margin: "6px 0 0", lineHeight: 1.6,
                  fontStyle: "italic", paddingRight: 4, fontFamily: "Georgia, 'Times New Roman', serif",
                }}>
                  {item.description}
                </p>
              )}

              {/* Add button */}
              <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-start" }}>
                {qty === 0 ? (
                  <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                    padding: "6px 20px", borderRadius: 4,
                    border: `1.5px solid ${primaryColor}`, backgroundColor: "transparent",
                    color: primaryColor, fontSize: 12, fontWeight: 700, cursor: "pointer",
                    fontFamily: "Georgia, 'Times New Roman', serif", transition: "all 0.2s",
                  }}>
                    سفارش
                  </button>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, border: `1.5px solid ${primaryColor}`, borderRadius: 4, padding: "2px 10px", backgroundColor: `${primaryColor}08` }}>
                    <button onClick={() => updateQuantity(item._id, qty - 1)} style={{
                      background: "none", border: "none", cursor: "pointer", color: primaryColor, padding: 4,
                      display: "flex", alignItems: "center",
                    }}>
                      <Minus style={{ width: 14, height: 14 }} />
                    </button>
                    <span style={{ fontWeight: 700, fontSize: 15, minWidth: 20, textAlign: "center", fontFamily: "Georgia, 'Times New Roman', serif" }}>{qty}</span>
                    <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                      background: "none", border: "none", cursor: "pointer", color: primaryColor, padding: 4,
                      display: "flex", alignItems: "center",
                    }}>
                      <Plus style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </main>

      {cartCount > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30,
          borderTop: `3px double ${primaryColor}`,
          backgroundColor: paperBg, padding: "14px 20px",
        }}>
          <TableCartLabel tableNumber={tableNumber} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, marginBottom: 8, color: textColor, opacity: 0.85 }} />
          <button onClick={() => router.push(`/${cafe.slug}/checkout`)} style={{
            width: "100%", maxWidth: 560, margin: "0 auto", display: "flex",
            alignItems: "center", justifyContent: "space-between",
            padding: "12px 20px", borderRadius: 2,
            backgroundColor: primaryColor, color: paperBg, border: "none", cursor: "pointer",
            fontSize: 14, fontWeight: 700, fontFamily: "Georgia, 'Times New Roman', serif",
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
