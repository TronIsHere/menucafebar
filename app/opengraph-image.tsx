import { ImageResponse } from "next/og";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { loadOgFonts, OG_FONT_FAMILY, ogSafeText } from "@/lib/og-font";
import { SITE_DESCRIPTION } from "@/lib/seo";

export const alt = `${APP_NAME} | ${APP_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function CoffeeIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 8h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z"
        fill="#f97316"
      />
      <path
        d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"
        stroke="#f97316"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 4c0 1.5 1 2.5 2 3"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10 3.5c0 1.5 1 2.5 2 3"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default async function OpenGraphImage() {
  const fonts = await loadOgFonts();
  const description = ogSafeText(SITE_DESCRIPTION);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #111827 0%, #1f2937 45%, #374151 100%)",
          color: "#ffffff",
          fontFamily: OG_FONT_FAMILY,
          direction: "rtl",
          textAlign: "right",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "rgba(249, 115, 22, 0.2)",
              border: "2px solid rgba(249, 115, 22, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CoffeeIcon />
          </div>
          <div style={{ fontSize: 36, fontWeight: 700 }}>{APP_NAME}</div>
        </div>

        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.25,
            marginBottom: 24,
            maxWidth: 900,
          }}
        >
          {APP_TAGLINE}
        </div>

        <div
          style={{
            fontSize: 28,
            lineHeight: 1.5,
            color: "rgba(255, 255, 255, 0.78)",
            maxWidth: 880,
          }}
        >
          {description}
        </div>

        <div
          style={{
            marginTop: 48,
            padding: "14px 28px",
            borderRadius: 999,
            background: "#f97316",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          شروع رایگان
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    },
  );
}
