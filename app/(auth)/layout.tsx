import type { Metadata } from "next";
import { appRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = appRouteMetadata;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
