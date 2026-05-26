import { UtensilsCrossed } from "lucide-react";

type MenuItemImageProps = {
  imageUrl?: string;
  alt: string;
  style?: React.CSSProperties;
  iconSize?: number;
  iconColor?: string;
  objectFit?: "contain" | "cover";
};

export default function MenuItemImage({
  imageUrl,
  alt,
  style,
  iconSize = 30,
  iconColor = "rgba(0,0,0,0.2)",
  objectFit = "contain",
}: MenuItemImageProps) {
  const containerStyle: React.CSSProperties = {
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...style,
  };

  if (imageUrl) {
    return (
      <div style={containerStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit,
            display: "block",
          }}
        />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <UtensilsCrossed
        style={{ width: iconSize, height: iconSize, color: iconColor }}
      />
    </div>
  );
}
