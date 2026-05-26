"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart";
import TableCartLabel from "@/components/menu/TableCartLabel";
import MenuItemImage from "@/components/menu/MenuItemImage";
import { Minus, Plus, Clock, UtensilsCrossed, ShoppingBag } from "lucide-react";
import type { TemplateProps } from "./types";
import { fmt } from "./types";

export default function DarkTemplate({ cafe, categories, items, template }: TemplateProps) {
  const router = useRouter();
  const { items: cartItems, addItem, updateQuantity, setSlug, total, tableNumber } = useCartStore();
  const [activeCatId, setActiveCatId] = useState(categories[0]?._id ?? "");

  const { primaryColor, accentColor, bgColor, cardBg, textColor } = template;
  const muted = "rgba(255,255,255,0.45)";
  const glowColor = accentColor;

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = total();

  useEffect(() => { setSlug(cafe.slug); }, [cafe.slug, setSlug]);

  const getQty = (id: string) => cartItems.find((i) => i.menuItemId === id)?.quantity ?? 0;
  const catItems = items.filter((i) => i.categoryId === activeCatId);

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: bgColor, color: textColor }}>

      {/* Minimal dark header with dot accent */}
      <header style={{
        backgroundColor: primaryColor,
        borderBottom: `1px solid ${accentColor}18`,
        padding: "12px 20px",
        position: "sticky", top: 0, zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            backgroundColor: accentColor,
            boxShadow: `0 0 8px ${accentColor}, 0 0 16px ${accentColor}66`,
          }} />
          <h1 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: textColor, letterSpacing: "0.03em" }}>
            {cafe.name}
          </h1>
        </div>
        <span style={{ fontSize: 11, color: muted, display: "flex", alignItems: "center", gap: 4 }}>
          <Clock style={{ width: 11, height: 11 }} />
          {cafe.openTime}–{cafe.closeTime}
        </span>
      </header>

      {/* Neon chip category tabs */}
      <div style={{
        position: "sticky", top: 44, zIndex: 10,
        backgroundColor: primaryColor,
        borderBottom: `1px solid ${accentColor}15`,
        overflowX: "auto", scrollbarWidth: "none",
        padding: "10px 20px",
      }}>
        <div style={{ display: "flex", gap: 8, maxWidth: 640, margin: "0 auto" }}>
          {categories.map((cat) => {
            const active = cat._id === activeCatId;
            return (
              <button key={cat._id} onClick={() => setActiveCatId(cat._id)} style={{
                flexShrink: 0, padding: "6px 14px", borderRadius: 6,
                border: `1px solid ${active ? accentColor : `${accentColor}25`}`,
                backgroundColor: active ? `${accentColor}15` : "transparent",
                color: active ? accentColor : muted,
                fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                boxShadow: active ? `0 0 10px ${accentColor}30, inset 0 0 10px ${accentColor}10` : "none",
                transition: "all 0.2s",
              }}>
                {cat.icon && <span style={{ marginLeft: 4 }}>{cat.icon}</span>}
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dark cards with glow border + large price */}
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px 120px" }}>
        {catItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 0", color: muted }}>
            <UtensilsCrossed style={{ width: 36, height: 36, margin: "0 auto 12px", opacity: 0.3, color: textColor }} />
            <p style={{ margin: 0, fontSize: 14 }}>آیتمی موجود نیست</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {catItems.map((item) => {
              const qty = getQty(item._id);
              return (
                <div key={item._id} style={{
                  backgroundColor: cardBg, borderRadius: 12,
                  border: `1px solid ${accentColor}20`,
                  overflow: "hidden",
                  boxShadow: `0 0 0 1px ${accentColor}08, 0 4px 20px rgba(0,0,0,0.4)`,
                  transition: "border-color 0.2s",
                  display: "flex", alignItems: "center", gap: 16, padding: 16,
                }}>
                  <MenuItemImage
                    imageUrl={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: 110,
                      height: 110,
                      flexShrink: 0,
                      borderRadius: 8,
                      backgroundColor: `${accentColor}08`,
                    }}
                    iconSize={36}
                    iconColor={`${accentColor}20`}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px", color: textColor }}>{item.name}</p>
                    {item.description && (
                      <p style={{ fontSize: 12, margin: "0 0 14px", color: muted, lineHeight: 1.6 }}>
                        {item.description}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{
                        fontSize: 18, fontWeight: 900, color: accentColor,
                        textShadow: `0 0 12px ${accentColor}60`,
                      }}>
                        {fmt(item.price)}
                      </span>

                      {qty === 0 ? (
                        <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                          padding: "9px 20px", borderRadius: 8,
                          border: `1px solid ${accentColor}`,
                          backgroundColor: `${accentColor}15`,
                          color: accentColor, fontSize: 13, fontWeight: 700, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 6,
                          boxShadow: `0 0 12px ${accentColor}20`,
                        }}>
                          <Plus style={{ width: 14, height: 14 }} />
                          افزودن
                        </button>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <button onClick={() => updateQuantity(item._id, qty - 1)} style={{
                            width: 32, height: 32, borderRadius: 8,
                            border: `1px solid ${accentColor}40`,
                            backgroundColor: "transparent", color: accentColor,
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Minus style={{ width: 13, height: 13 }} />
                          </button>
                          <span style={{
                            fontWeight: 800, fontSize: 16, color: accentColor, minWidth: 24, textAlign: "center",
                            textShadow: `0 0 8px ${accentColor}50`,
                          }}>{qty}</span>
                          <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                            width: 32, height: 32, borderRadius: 8,
                            border: `1px solid ${accentColor}`,
                            backgroundColor: `${accentColor}20`, color: accentColor,
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: `0 0 8px ${accentColor}30`,
                          }}>
                            <Plus style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Glowing cart button */}
      {cartCount > 0 && (
        <div style={{ position: "fixed", bottom: 24, left: 16, right: 16, zIndex: 30 }}>
          <TableCartLabel
            tableNumber={tableNumber}
            style={{
              textAlign: "center",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
              color: textColor,
              opacity: 0.85,
            }}
          />
          <button onClick={() => router.push(`/${cafe.slug}/checkout`)} style={{
            width: "100%", maxWidth: 608, margin: "0 auto", display: "flex",
            alignItems: "center", justifyContent: "space-between",
            padding: "14px 22px", borderRadius: 12,
            backgroundColor: cardBg, color: textColor,
            border: `1px solid ${glowColor}40`,
            cursor: "pointer",
            boxShadow: `0 0 20px ${glowColor}30, 0 0 40px ${glowColor}15, 0 8px 32px rgba(0,0,0,0.6)`,
            fontSize: 14, fontWeight: 700,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                backgroundColor: `${glowColor}20`, border: `1px solid ${glowColor}50`,
                color: glowColor, borderRadius: 8, width: 28, height: 28,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, boxShadow: `0 0 8px ${glowColor}40`,
              }}>{cartCount}</span>
              <ShoppingBag style={{ width: 16, height: 16, color: glowColor }} />
              <span style={{ color: textColor }}>مشاهده سبد</span>
            </span>
            <span style={{ color: glowColor, fontWeight: 900, textShadow: `0 0 10px ${glowColor}60` }}>
              {fmt(cartTotal)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
