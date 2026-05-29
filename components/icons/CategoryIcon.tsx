"use client";

import type { SVGProps } from "react";
import { getCategoryIcon } from "@/lib/icons/category-icons";
import { isReactIconId } from "@/lib/icons/types";

type CategoryIconProps = SVGProps<SVGSVGElement> & {
  icon?: string;
  size?: number | string;
  fallback?: string;
  emojiClassName?: string;
};

export function CategoryIcon({
  icon,
  size = 16,
  fallback = "lu:LuUtensilsCrossed",
  emojiClassName,
  style,
  className,
  ...props
}: CategoryIconProps) {
  const resolved = icon || fallback;

  if (isReactIconId(resolved)) {
    const Icon = getCategoryIcon(resolved);
    return (
      <Icon
        size={size}
        className={className}
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
        {...props}
      />
    );
  }

  return (
    <span
      className={emojiClassName}
      style={{ fontSize: size, lineHeight: 1, ...style }}
      aria-hidden
    >
      {resolved}
    </span>
  );
}
