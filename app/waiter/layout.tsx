import type { Metadata } from "next";
import { appRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = appRouteMetadata;

export default function WaiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
