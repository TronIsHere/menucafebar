import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_FONT_FAMILY = "IRANSans";

/** Local IRANSans weights for next/og ImageResponse (no Google Fonts fallback). */
export async function loadOgFonts() {
  const fontsDir = join(process.cwd(), "public/fonts");

  const [bold, regular] = await Promise.all([
    readFile(join(fontsDir, "IRANSans-Bold.woff")),
    readFile(join(fontsDir, "IRANSans-Reg.woff")),
  ]);

  return [
    {
      name: OG_FONT_FAMILY,
      data: bold,
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: OG_FONT_FAMILY,
      data: regular,
      weight: 400 as const,
      style: "normal" as const,
    },
  ];
}

/** Strip characters that trigger @vercel/og Google Fonts fallback during build. */
export function ogSafeText(text: string): string {
  return text.replace(/\u2014/g, "|").replace(/[\u{1F300}-\u{1FAFF}]/gu, "");
}
