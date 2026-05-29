import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { SITE_DESCRIPTION } from "@/lib/seo";

export const alt = `${APP_NAME} — ${APP_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const fontPath = join(process.cwd(), "public/fonts/IRANSans-Bold.woff");
  const fontData = await readFile(fontPath);

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
          fontFamily: "IranSans",
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
              fontSize: 36,
            }}
          >
            ☕
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
          {SITE_DESCRIPTION}
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
      fonts: [
        {
          name: "IranSans",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
