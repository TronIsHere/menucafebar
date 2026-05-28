import Image from "next/image";
import { cn } from "@/lib/utils";
import { APP_LOGO, APP_NAME } from "@/lib/brand";

const sizeMap = {
  xs: { box: "w-8 h-8", px: 32 },
  sm: { box: "w-10 h-10", px: 40 },
  md: { box: "w-16 h-16", px: 64 },
  lg: { box: "w-20 h-20", px: 80 },
} as const;

type AppLogoSize = keyof typeof sizeMap;

export function AppLogo({
  size = "sm",
  className,
  alt = APP_NAME,
}: {
  size?: AppLogoSize;
  className?: string;
  alt?: string;
}) {
  const { box, px } = sizeMap[size];

  return (
    <Image
      src={APP_LOGO}
      alt={alt}
      width={px}
      height={px}
      className={cn("shrink-0 object-contain", box, className)}
      priority={size === "md" || size === "lg"}
    />
  );
}
