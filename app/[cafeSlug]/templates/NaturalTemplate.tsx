"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart";
import TableCartLabel from "@/components/menu/TableCartLabel";
import MenuItemImage from "@/components/menu/MenuItemImage";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { Minus, Plus, MapPin, Clock, UtensilsCrossed, ShoppingBag } from "@/lib/icons/app-icons";
import type { TemplateProps } from "./types";
import { cafeHoursLabel, fmt } from "./types";

export default function NaturalTemplate({ cafe, categories, items, template }: TemplateProps) {
  const router = useRouter();
  const { items: cartItems, addItem, updateQuantity, setSlug, total, tableNumber } = useCartStore();
  const [activeCatId, setActiveCatId] = useState(categories[0]?._id ?? "");

  const { primaryColor, accentColor, bgColor, cardBg, textColor } = template;
  const muted = `${textColor}60`;

  const sectionRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});
  const navRef = useRef<HTMLDivElement>(null);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = total();

  useEffect(() => { setSlug(cafe.slug); }, [cafe.slug, setSlug]);

  // IntersectionObserver — update active category as user scrolls
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
      { rootMargin: "-100px 0px -55% 0px", threshold: 0 }
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
    const offset = 130;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveCatId(catId);
  }

  const getQty = (id: string) => cartItems.find((i) => i.menuItemId === id)?.quantity ?? 0;

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: bgColor, color: textColor }}>

      {/* Nature-themed header */}
      <header style={{
        background: `linear-gradient(160deg, ${primaryColor} 0%, ${primaryColor}e8 70%, ${accentColor}66 100%)`,
        color: "#fff", padding: "28px 20px 24px",
        position: "sticky", top: 0, zIndex: 20,
        boxShadow: "0 3px 16px rgba(0,0,0,0.2)",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 18 }}>🌿</span>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>{cafe.name}</h1>
            <span style={{ fontSize: 18 }}>🌿</span>
          </div>
          <div style={{ display: "flex", gap: 18, fontSize: 12, opacity: 0.7 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin style={{ width: 11, height: 11 }} />{cafe.city} — {cafe.address}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Clock style={{ width: 11, height: 11 }} />{cafeHoursLabel(cafe)}
            </span>
          </div>
        </div>
      </header>

      {/* Sticky anchor-scroll nav */}
      <div ref={navRef} style={{
        position: "sticky", top: 80, zIndex: 10,
        backgroundColor: bgColor,
        borderBottom: `2px solid ${accentColor}30`,
        overflowX: "auto", scrollbarWidth: "none",
        padding: "10px 20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", gap: 8, maxWidth: 640, margin: "0 auto" }}>
          {categories.map((cat) => {
            const active = cat._id === activeCatId;
            return (
              <button key={cat._id} onClick={() => scrollToSection(cat._id)} style={{
                flexShrink: 0, padding: "7px 16px", borderRadius: 999,
                border: `1.5px solid ${active ? primaryColor : `${primaryColor}30`}`,
                backgroundColor: active ? primaryColor : "transparent",
                color: active ? "#fff" : primaryColor,
                fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}>
                <CategoryIcon icon={cat.icon} size={14} style={{ marginLeft: 4 }} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* All sections rendered — scroll to anchor */}
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "8px 16px 120px" }}>
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.categoryId === cat._id);
          return (
            <div
              key={cat._id}
              ref={(el) => { sectionRefs.current[cat._id] = el; }}
              data-cat-id={cat._id}
            >
              {/* Section header with leaf decorations */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "24px 0 14px",
              }}>
                <div style={{ flex: 1, height: 1, backgroundColor: `${accentColor}40` }} />
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14 }}>🌱</span>
                  <h2 style={{
                    fontSize: 15, fontWeight: 800, margin: 0, color: primaryColor,
                    letterSpacing: "0.02em",
                  }}>
                    <CategoryIcon icon={cat.icon} size={14} style={{ marginLeft: 5 }} />
                    {cat.name}
                  </h2>
                  <span style={{ fontSize: 14 }}>🌱</span>
                </div>
                <div style={{ flex: 1, height: 1, backgroundColor: `${accentColor}40` }} />
              </div>

              {catItems.length === 0 ? (
                <p style={{ textAlign: "center", color: muted, fontSize: 13, padding: "16px 0" }}>آیتمی موجود نیست</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 8 }}>
                  {catItems.map((item) => {
                    const qty = getQty(item._id);
                    return (
                      <div key={item._id} style={{
                        backgroundColor: cardBg, borderRadius: 20,
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        border: `1px solid ${accentColor}18`,
                        display: "flex", alignItems: "center", gap: 14, padding: 12,
                      }}>
                        <MenuItemImage
                          imageUrl={item.imageUrl}
                          alt={item.name}
                          style={{
                            width: 100,
                            height: 100,
                            flexShrink: 0,
                            borderRadius: 12,
                            backgroundColor: `${primaryColor}14`,
                          }}
                          iconSize={32}
                          iconColor={`${primaryColor}30`}
                        />
                        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: textColor, lineHeight: 1.3 }}>{item.name}</p>
                          {item.description && (
                            <p style={{ fontSize: 11, margin: 0, color: muted, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {item.description}
                            </p>
                          )}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: accentColor }}>{fmt(item.price)}</span>
                            {qty === 0 ? (
                              <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                                width: 28, height: 28, borderRadius: 999,
                                backgroundColor: primaryColor, color: "#fff",
                                border: "none", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                <Plus style={{ width: 13, height: 13 }} />
                              </button>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <button onClick={() => updateQuantity(item._id, qty - 1)} style={{
                                  width: 24, height: 24, borderRadius: 999,
                                  backgroundColor: `${primaryColor}22`, color: primaryColor,
                                  border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                  <Minus style={{ width: 11, height: 11 }} />
                                </button>
                                <span style={{ fontWeight: 700, fontSize: 12, color: textColor, minWidth: 16, textAlign: "center" }}>{qty}</span>
                                <button onClick={() => addItem({ menuItemId: item._id, name: item.name, price: item.price })} style={{
                                  width: 24, height: 24, borderRadius: 999,
                                  backgroundColor: primaryColor, color: "#fff",
                                  border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
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

      {/* Earthy floating cart */}
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
            padding: "14px 22px", borderRadius: 20,
            backgroundColor: primaryColor, color: "#fff",
            border: "none", cursor: "pointer",
            boxShadow: `0 6px 20px ${primaryColor}50`, fontSize: 14, fontWeight: 700,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                backgroundColor: accentColor, width: 28, height: 28, borderRadius: 999,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: "#1a1a1a",
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
