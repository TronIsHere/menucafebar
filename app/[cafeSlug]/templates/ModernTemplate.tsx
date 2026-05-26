"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart";
import TableCartLabel from "@/components/menu/TableCartLabel";
import MenuItemImage from "@/components/menu/MenuItemImage";
import { Minus, Plus, Search, ShoppingBag, UtensilsCrossed } from "lucide-react";
import type { TemplateProps } from "./types";
import { fmt } from "./types";

export default function ModernTemplate({ cafe, categories, items, template }: TemplateProps) {
  const router = useRouter();
  const { items: cartItems, addItem, updateQuantity, setSlug, total, tableNumber } = useCartStore();
  const [activeCatId, setActiveCatId] = useState(categories[0]?._id ?? "");
  const [search, setSearch] = useState("");

  const { primaryColor, accentColor, bgColor, cardBg, textColor } = template;
  const muted = `${textColor}60`;

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = total();

  useEffect(() => { setSlug(cafe.slug); }, [cafe.slug, setSlug]);

  const getQty = (id: string) => cartItems.find((i) => i.menuItemId === id)?.quantity ?? 0;

  const catItems = items
    .filter((i) => i.categoryId === activeCatId)
    .filter((i) => !search || i.name.includes(search) || (i.description ?? "").includes(search));

  const catCount = (id: string) => items.filter((i) => i.categoryId === id).length;

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: bgColor, color: textColor }}>

      {/* Compact header */}
      <header style={{
        backgroundColor: primaryColor, color: "#fff",
        padding: "12px 16px",
        position: "sticky", top: 0, zIndex: 20,
        boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>{cafe.name}</h1>
          <span style={{ fontSize: 11, opacity: 0.65 }}>{cafe.openTime}–{cafe.closeTime}</span>
        </div>
      </header>

      {/* Sticky search bar */}
      <div style={{
        position: "sticky", top: 44, zIndex: 19,
        backgroundColor: bgColor,
        borderBottom: `1px solid ${textColor}10`,
        padding: "10px 16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
          <Search style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            width: 15, height: 15, color: muted,
          }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در منو..."
            style={{
              width: "100%", padding: "9px 38px 9px 14px",
              borderRadius: 8, border: `1.5px solid ${textColor}15`,
              backgroundColor: cardBg, color: textColor, fontSize: 13,
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Category chips with item count */}
      <div style={{
        position: "sticky", top: 90, zIndex: 18,
        backgroundColor: bgColor,
        borderBottom: `1px solid ${textColor}10`,
        overflowX: "auto", scrollbarWidth: "none",
        padding: "10px 16px",
      }}>
        <div style={{ display: "flex", gap: 8, maxWidth: 640, margin: "0 auto" }}>
          {categories.map((cat) => {
            const active = cat._id === activeCatId;
            return (
              <button key={cat._id} onClick={() => { setActiveCatId(cat._id); setSearch(""); }} style={{
                flexShrink: 0, display: "flex", alignItems: "center", gap: 5,
                padding: "6px 14px", borderRadius: 8,
                border: `1.5px solid ${active ? accentColor : `${textColor}18`}`,
                backgroundColor: active ? accentColor : cardBg,
                color: active ? "#fff" : textColor,
                fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}>
                {cat.icon && <span>{cat.icon}</span>}
                {cat.name}
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  backgroundColor: active ? "rgba(255,255,255,0.25)" : `${textColor}12`,
                  color: active ? "#fff" : muted,
                  borderRadius: 99, padding: "1px 6px", minWidth: 18, textAlign: "center",
                }}>
                  {catCount(cat._id)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-column grid */}
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 120px" }}>
        {catItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 0", color: muted }}>
            <UtensilsCrossed style={{ width: 36, height: 36, margin: "0 auto 12px", opacity: 0.35, color: textColor }} />
            <p style={{ margin: 0, fontSize: 14 }}>{search ? "نتیجه‌ای یافت نشد" : "آیتمی موجود نیست"}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {catItems.map((item) => {
              const qty = getQty(item._id);
              return (
                <div key={item._id} style={{
                  backgroundColor: cardBg, borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)", overflow: "hidden",
                  display: "flex", flexDirection: "column",
                }}>
                  <MenuItemImage
                    imageUrl={item.imageUrl}
                    alt={item.name}
                    style={{
                      height: 120,
                      backgroundColor: `${primaryColor}14`,
                    }}
                    iconSize={36}
                    iconColor={`${primaryColor}30`}
                  />
                  {/* Info */}
                  <div style={{ padding: "10px 12px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: textColor, lineHeight: 1.4 }}>{item.name}</p>
                    {item.description && (
                      <p style={{ fontSize: 11, margin: 0, color: muted, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {item.description}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: accentColor }}>{fmt(item.price)}</span>
                      {qty === 0 ? (
                        <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                          width: 28, height: 28, borderRadius: 8, backgroundColor: primaryColor,
                          color: "#fff", border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Plus style={{ width: 14, height: 14 }} />
                        </button>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button onClick={() => updateQuantity(item._id, qty - 1)} style={{
                            width: 24, height: 24, borderRadius: 6, backgroundColor: `${primaryColor}20`,
                            color: primaryColor, border: "none", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Minus style={{ width: 11, height: 11 }} />
                          </button>
                          <span style={{ fontWeight: 700, fontSize: 13, color: textColor, minWidth: 18, textAlign: "center" }}>{qty}</span>
                          <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                            width: 24, height: 24, borderRadius: 6, backgroundColor: primaryColor,
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
              );
            })}
          </div>
        )}
      </main>

      {/* Floating pill cart */}
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
            padding: "13px 20px", borderRadius: 999,
            backgroundColor: primaryColor, color: "#fff", border: "none", cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.22)", fontSize: 13, fontWeight: 700,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                backgroundColor: accentColor, color: "#fff", borderRadius: 999,
                width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800,
              }}>{cartCount}</span>
              <ShoppingBag style={{ width: 15, height: 15 }} />
              سبد سفارش
            </span>
            <span style={{ color: accentColor, fontWeight: 800 }}>{fmt(cartTotal)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
