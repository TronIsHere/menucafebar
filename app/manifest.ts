import type { MetadataRoute } from "next";
import { APP_LOGO, APP_NAME, APP_TITLE } from "@/lib/brand";
import { SITE_DESCRIPTION } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_TITLE,
    short_name: APP_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    dir: "rtl",
    lang: "fa",
    background_color: "#ffffff",
    theme_color: "#111827",
    categories: ["business", "food"],
    icons: [
      {
        src: APP_LOGO,
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "داشبورد",
        short_name: "داشبورد",
        url: "/dashboard",
        icons: [{ src: APP_LOGO, sizes: "any" }],
      },
      {
        name: "حالت پیشخدمت",
        short_name: "پیشخدمت",
        url: "/waiter",
        icons: [{ src: APP_LOGO, sizes: "any" }],
      },
    ],
  };
}
