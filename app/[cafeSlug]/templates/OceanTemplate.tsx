"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart";
import TableCartLabel from "@/components/menu/TableCartLabel";
import MenuItemImage from "@/components/menu/MenuItemImage";
import { Minus, Plus, MapPin, Clock, UtensilsCrossed, ShoppingBag } from "lucide-react";
import type { TemplateProps } from "./types";
import { fmt } from "./types";

export default function OceanTemplate({ cafe, categories, items, template }: TemplateProps) {
  const router = useRouter();
  const { items: cartItems, addItem, updateQuantity, setSlug, total, tableNumber } = useCartStore();
  const [activeCatId, setActiveCatId] = useState(categories[0]?._id ?? "");

  const { primaryColor, accentColor, bgColor, cardBg, textColor } = template;
  const muted = `${textColor}55`;

  const sectionRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = total();

  useEffect(() => { setSlug(cafe.slug); }, [cafe.slug, setSlug]);

  // IntersectionObserver for anchor scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-cat-id");
            if (id) setActiveCatId(id);
          }
        });
      },
      { rootMargin: "-110px 0px -55% 0px", threshold: 0 }
    );
    categories.forEach((cat) => {
      const el = sectionRefs.current[cat._id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [categories]);

  function scrollToSection(catId: string) {
    const el = sectionRefs.current[catId];
    if (!el) return;
    const offset = 150;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveCatId(catId);
  }

  const getQty = (id: string) => cartItems.find((i) => i.menuItemId === id)?.quantity ?? 0;

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: bgColor, color: textColor }}>

      {/* Clean white/blue header */}
      <header style={{
        backgroundColor: primaryColor, color: "#fff",
        padding: "22px 20px 20px",
        position: "sticky", top: 0, zIndex: 20,
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{cafe.name}</h1>
          <div style={{ display: "flex", gap: 18, marginTop: 6, fontSize: 12, opacity: 0.75 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin style={{ width: 11, height: 11 }} />{cafe.city} — {cafe.address}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Clock style={{ width: 11, height: 11 }} />{cafe.openTime}–{cafe.closeTime}
            </span>
          </div>
        </div>
      </header>

      {/* Underline tabs on white bar — anchor scroll */}
      <div style={{
        position: "sticky", top: 80, zIndex: 10,
        backgroundColor: cardBg,
        borderBottom: `2px solid ${textColor}0c`,
        overflowX: "auto", scrollbarWidth: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", maxWidth: 640, margin: "0 auto", padding: "0 20px" }}>
          {categories.map((cat) => {
            const active = cat._id === activeCatId;
            return (
              <button key={cat._id} onClick={() => scrollToSection(cat._id)} style={{
                flexShrink: 0, padding: "16px 18px 14px",
                fontSize: 13, fontWeight: active ? 700 : 500,
                color: active ? primaryColor : muted,
                background: "none", border: "none",
                borderBottom: `2px solid ${active ? accentColor : "transparent"}`,
                marginBottom: -2,
                cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
              }}>
                {cat.icon && <span style={{ marginLeft: 5 }}>{cat.icon}</span>}
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* All sections — airy grid layout */}
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "8px 20px 120px" }}>
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.categoryId === cat._id);
          return (
            <div
              key={cat._id}
              ref={(el) => { sectionRefs.current[cat._id] = el; }}
              data-cat-id={cat._id}
            >
              {/* Clean section header */}
              <div style={{ padding: "28px 0 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: primaryColor }}>
                  {cat.icon && <span style={{ marginLeft: 6 }}>{cat.icon}</span>}
                  {cat.name}
                </h2>
                <div style={{ flex: 1, height: 1, backgroundColor: `${primaryColor}20` }} />
                <span style={{ fontSize: 11, color: muted, whiteSpace: "nowrap" }}>
                  {catItems.length} آیتم
                </span>
              </div>

              {catItems.length === 0 ? (
                <p style={{ color: muted, fontSize: 13, paddingBottom: 8 }}>آیتمی موجود نیست</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, paddingBottom: 8 }}>
                  {catItems.map((item) => {
                    const qty = getQty(item._id);
                    return (
                      <div key={item._id} style={{
                        backgroundColor: cardBg, borderRadius: 14, overflow: "hidden",
                        border: `1px solid ${primaryColor}12`,
                        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                        display: "flex", flexDirection: "column",
                      }}>
                        <MenuItemImage
                          imageUrl={item.imageUrl}
                          alt={item.name}
                          style={{
                            height: 120,
                            backgroundColor: `${primaryColor}10`,
                          }}
                          iconSize={34}
                          iconColor={`${primaryColor}28`}
                        />
                        {/* Info */}
                        <div style={{ padding: "10px 12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
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
                                width: 30, height: 30, borderRadius: 8, backgroundColor: primaryColor,
                                color: "#fff", border: "none", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                <Plus style={{ width: 14, height: 14 }} />
                              </button>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <button onClick={() => updateQuantity(item._id, qty - 1)} style={{
                                  width: 26, height: 26, borderRadius: 6, backgroundColor: `${primaryColor}15`,
                                  color: primaryColor, border: "none", cursor: "pointer",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                  <Minus style={{ width: 11, height: 11 }} />
                                </button>
                                <span style={{ fontWeight: 700, fontSize: 13, color: textColor, minWidth: 18, textAlign: "center" }}>{qty}</span>
                                <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                                  width: 26, height: 26, borderRadius: 6, backgroundColor: primaryColor,
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
            </div>
          );
        })}
      </main>

      {/* Clean ocean cart button */}
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
            width: "100%", maxWidth: 600, margin: "0 auto", display: "flex",
            alignItems: "center", justifyContent: "space-between",
            padding: "14px 22px", borderRadius: 14,
            backgroundColor: primaryColor, color: "#fff",
            border: "none", cursor: "pointer",
            boxShadow: `0 4px 20px ${primaryColor}45`, fontSize: 14, fontWeight: 700,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8,
                width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800,
              }}>{cartCount}</span>
              <ShoppingBag style={{ width: 16, height: 16 }} />
              مشاهده سبد
            </span>
            <span style={{ color: accentColor, fontWeight: 800 }}>{fmt(cartTotal)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
