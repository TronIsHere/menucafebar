"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart";
import TableCartLabel from "@/components/menu/TableCartLabel";
import MenuItemImage from "@/components/menu/MenuItemImage";
import { Minus, Plus, MapPin, Clock, UtensilsCrossed, ShoppingBag, Star } from "lucide-react";
import type { TemplateProps } from "./types";
import { fmt } from "./types";

export default function WarmTemplate({ cafe, categories, items, template }: TemplateProps) {
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

  function QtyControl({ item }: { item: (typeof catItems)[0] }) {
    const qty = getQty(item._id);
    if (qty === 0) return (
      <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
        padding: "9px 20px", borderRadius: 12, backgroundColor: primaryColor,
        color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <Plus style={{ width: 14, height: 14 }} />
        افزودن
      </button>
    );
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => updateQuantity(item._id, qty - 1)} style={{
          width: 30, height: 30, borderRadius: 10, backgroundColor: `${primaryColor}18`,
          color: primaryColor, border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Minus style={{ width: 12, height: 12 }} />
        </button>
        <span style={{ fontWeight: 700, fontSize: 15, color: textColor, minWidth: 22, textAlign: "center" }}>{qty}</span>
        <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
          width: 30, height: 30, borderRadius: 10, backgroundColor: primaryColor,
          color: "#fff", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Plus style={{ width: 12, height: 12 }} />
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: bgColor, color: textColor }}>

      {/* Warm hero header */}
      <header style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}e0 60%, ${accentColor}55 100%)`,
        color: "#fff", padding: "32px 20px 28px",
        position: "sticky", top: 0, zIndex: 20,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.2em", opacity: 0.65, margin: "0 0 8px" }}>
            ☕ {cafe.city}
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>{cafe.name}</h1>
          <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, opacity: 0.7 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin style={{ width: 11, height: 11 }} />{cafe.address}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Clock style={{ width: 11, height: 11 }} />{cafe.openTime}–{cafe.closeTime}
            </span>
          </div>
          <div style={{ width: 40, height: 3, backgroundColor: accentColor, borderRadius: 99, marginTop: 14 }} />
        </div>
      </header>

      {/* Cozy pill tabs */}
      <div style={{
        position: "sticky", top: 110, zIndex: 10,
        backgroundColor: `${primaryColor}ee`,
        overflowX: "auto", scrollbarWidth: "none",
        padding: "10px 16px",
      }}>
        <div style={{ display: "flex", gap: 8, maxWidth: 640, margin: "0 auto" }}>
          {categories.map((cat) => {
            const active = cat._id === activeCatId;
            return (
              <button key={cat._id} onClick={() => setActiveCatId(cat._id)} style={{
                flexShrink: 0, padding: "8px 18px", borderRadius: 999,
                backgroundColor: active ? accentColor : "transparent",
                color: active ? "#1a1a1a" : "rgba(255,255,255,0.75)",
                border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.15s",
                boxShadow: active ? `0 2px 8px ${accentColor}50` : "none",
              }}>
                {cat.icon && <span style={{ marginLeft: 5 }}>{cat.icon}</span>}
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Magazine layout — featured first item + grid for rest */}
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 120px" }}>
        {catItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 0", color: muted }}>
            <UtensilsCrossed style={{ width: 36, height: 36, margin: "0 auto 12px", opacity: 0.35, color: textColor }} />
            <p style={{ margin: 0, fontSize: 14 }}>آیتمی موجود نیست</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {catItems.map((item, idx) => (
              <div key={item._id} style={{
                backgroundColor: cardBg, borderRadius: idx === 0 ? 16 : 14, overflow: "hidden",
                boxShadow: idx === 0 ? "0 4px 20px rgba(0,0,0,0.1)" : "0 2px 10px rgba(0,0,0,0.07)",
                border: `1px solid ${idx === 0 ? `${accentColor}20` : `${textColor}08`}`,
                display: "flex", alignItems: "center", gap: 16, padding: 16,
              }}>
                <MenuItemImage
                  imageUrl={item.imageUrl}
                  alt={item.name}
                  style={{
                    width: idx === 0 ? 130 : 100,
                    height: idx === 0 ? 130 : 100,
                    flexShrink: 0,
                    borderRadius: 12,
                    backgroundColor: `${primaryColor}10`,
                  }}
                  iconSize={idx === 0 ? 44 : 34}
                  iconColor={`${primaryColor}25`}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  {idx === 0 && (
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      backgroundColor: accentColor, borderRadius: 12,
                      padding: "4px 10px", marginBottom: 8,
                    }}>
                      <Star style={{ width: 11, height: 11, color: primaryColor }} />
                      <span style={{ fontSize: 11, fontWeight: 800, color: primaryColor }}>پیشنهاد شف</span>
                    </div>
                  )}
                  <p style={{ fontSize: idx === 0 ? 19 : 13, fontWeight: idx === 0 ? 900 : 700, margin: "0 0 6px", color: textColor, lineHeight: 1.3 }}>{item.name}</p>
                  {item.description && (
                    <p style={{ fontSize: idx === 0 ? 13 : 11, margin: "0 0 14px", color: muted, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {item.description}
                    </p>
                  )}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: idx === 0 ? 17 : 12, fontWeight: 800, color: accentColor }}>{fmt(item.price)}</span>
                    {idx === 0 ? (
                      <QtyControl item={item} />
                    ) : getQty(item._id) === 0 ? (
                      <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                        width: 28, height: 28, borderRadius: 10, backgroundColor: primaryColor,
                        color: "#fff", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Plus style={{ width: 13, height: 13 }} />
                      </button>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <button onClick={() => updateQuantity(item._id, getQty(item._id) - 1)} style={{
                          width: 24, height: 24, borderRadius: 8, backgroundColor: `${primaryColor}18`,
                          color: primaryColor, border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Minus style={{ width: 11, height: 11 }} />
                        </button>
                        <span style={{ fontWeight: 700, fontSize: 12, color: textColor, minWidth: 16, textAlign: "center" }}>{getQty(item._id)}</span>
                        <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                          width: 24, height: 24, borderRadius: 8, backgroundColor: primaryColor,
                          color: "#fff", border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Plus style={{ width: 11, height: 11 }} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Warm floating cart */}
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
            padding: "14px 22px", borderRadius: 16,
            backgroundColor: primaryColor, color: "#fff",
            border: "none", cursor: "pointer",
            boxShadow: `0 6px 24px ${primaryColor}55`, fontSize: 14, fontWeight: 700,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                backgroundColor: accentColor, color: primaryColor, borderRadius: 12,
                width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800,
              }}>{cartCount}</span>
              <ShoppingBag style={{ width: 16, height: 16 }} />
              سبد سفارش
            </span>
            <span style={{ color: accentColor, fontWeight: 800 }}>{fmt(cartTotal)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
