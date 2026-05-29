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

export default function ColorfulTemplate({ cafe, categories, items, template }: TemplateProps) {
  const router = useRouter();
  const { items: cartItems, addItem, updateQuantity, setSlug, total, tableNumber } = useCartStore();
  const [activeCatId, setActiveCatId] = useState(categories[0]?._id ?? "");

  const { primaryColor, accentColor, bgColor, cardBg, textColor } = template;
  const muted = `${textColor}60`;

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = total();

  useEffect(() => { setSlug(cafe.slug); }, [cafe.slug, setSlug]);

  const getQty = (id: string) => cartItems.find((i) => i.menuItemId === id)?.quantity ?? 0;
  const catItems = items.filter((i) => i.categoryId === activeCatId);
  const activeCategory = categories.find((c) => c._id === activeCatId);

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: bgColor, color: textColor }}>

      {/* Gradient hero header */}
      <header style={{
        background: `linear-gradient(145deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${accentColor}99 100%)`,
        color: "#fff", textAlign: "center",
        padding: "40px 24px 36px",
        position: "sticky", top: 0, zIndex: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.22)",
      }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0, lineHeight: 1.1 }}>{cafe.name}</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 10, fontSize: 12, opacity: 0.75 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin style={{ width: 11, height: 11 }} />{cafe.city}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock style={{ width: 11, height: 11 }} />{cafe.openTime}–{cafe.closeTime}
          </span>
        </div>
      </header>

      {/* Story-circle category nav */}
      <div style={{
        position: "sticky", top: 100, zIndex: 10,
        backgroundColor: bgColor,
        borderBottom: `1px solid ${textColor}10`,
        overflowX: "auto", scrollbarWidth: "none",
        padding: "16px 20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", gap: 16, justifyContent: categories.length <= 4 ? "center" : "flex-start" }}>
          {categories.map((cat) => {
            const active = cat._id === activeCatId;
            return (
              <button key={cat._id} onClick={() => setActiveCatId(cat._id)} style={{
                flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}>
                {/* Story circle */}
                <div style={{
                  width: 62, height: 62, borderRadius: "50%",
                  padding: 3,
                  background: active
                    ? `linear-gradient(135deg, ${primaryColor}, ${accentColor})`
                    : `${textColor}15`,
                }}>
                  <div style={{
                    width: "100%", height: "100%", borderRadius: "50%",
                    backgroundColor: active ? primaryColor : cardBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>
                    <CategoryIcon icon={cat.icon} size={20} />
                  </div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: active ? 700 : 500,
                  color: active ? primaryColor : muted,
                  whiteSpace: "nowrap", maxWidth: 72, textAlign: "center",
                  overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active category banner */}
      {activeCategory && (
        <div style={{
          backgroundColor: `${primaryColor}10`,
          borderBottom: `2px solid ${accentColor}40`,
          padding: "12px 20px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>{activeCategory.icon ?? "🍽️"}</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: primaryColor }}>{activeCategory.name}</span>
          <span style={{ fontSize: 12, color: muted, marginRight: "auto" }}>{catItems.length} آیتم</span>
        </div>
      )}

      {/* Single-column large cards */}
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "16px 16px 120px" }}>
        {catItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 0", color: muted }}>
            <UtensilsCrossed style={{ width: 36, height: 36, margin: "0 auto 12px", opacity: 0.35, color: textColor }} />
            <p style={{ margin: 0, fontSize: 14 }}>آیتمی موجود نیست</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {catItems.map((item) => {
              const qty = getQty(item._id);
              return (
                <div key={item._id} style={{
                  backgroundColor: cardBg, borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  border: `1px solid ${textColor}08`,
                  display: "flex", alignItems: "center", gap: 16, padding: 16,
                }}>
                  <MenuItemImage
                    imageUrl={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: 110,
                      height: 110,
                      flexShrink: 0,
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${primaryColor}18, ${accentColor}18)`,
                    }}
                    iconSize={40}
                    iconColor={`${primaryColor}25`}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 17, fontWeight: 800, margin: "0 0 6px", color: textColor }}>{item.name}</p>
                    {item.description && (
                      <p style={{ fontSize: 13, margin: "0 0 14px", color: muted, lineHeight: 1.6 }}>
                        {item.description}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: accentColor }}>{fmt(item.price)}</span>
                      {qty === 0 ? (
                        <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                          padding: "10px 24px", borderRadius: 999,
                          backgroundColor: primaryColor, color: "#fff",
                          border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700,
                          display: "flex", alignItems: "center", gap: 6,
                          boxShadow: `0 4px 12px ${primaryColor}44`,
                        }}>
                          <Plus style={{ width: 15, height: 15 }} />
                          افزودن
                        </button>
                      ) : (
                        <div style={{
                          display: "flex", alignItems: "center", gap: 12,
                          backgroundColor: `${primaryColor}12`,
                          borderRadius: 999, padding: "6px 16px",
                        }}>
                          <button onClick={() => updateQuantity(item._id, qty - 1)} style={{
                            width: 30, height: 30, borderRadius: "50%", backgroundColor: primaryColor,
                            color: "#fff", border: "none", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Minus style={{ width: 13, height: 13 }} />
                          </button>
                          <span style={{ fontWeight: 800, fontSize: 15, color: primaryColor, minWidth: 24, textAlign: "center" }}>{qty}</span>
                          <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                            width: 30, height: 30, borderRadius: "50%", backgroundColor: primaryColor,
                            color: "#fff", border: "none", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
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

      {/* Colorful floating cart */}
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
            width: "100%", maxWidth: 568, margin: "0 auto", display: "flex",
            alignItems: "center", justifyContent: "space-between",
            padding: "15px 22px", borderRadius: 999,
            background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
            color: "#fff", border: "none", cursor: "pointer",
            boxShadow: `0 6px 24px ${primaryColor}55`, fontSize: 14, fontWeight: 700,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 999,
                width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 900,
              }}>{cartCount}</span>
              <ShoppingBag style={{ width: 16, height: 16 }} />
              مشاهده سبد
            </span>
            <span style={{ fontWeight: 900 }}>{fmt(cartTotal)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
