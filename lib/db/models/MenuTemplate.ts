import mongoose, { Document, Schema } from "mongoose";

export interface IMenuTemplate extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  thumbnail: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  cardBg: string;
  textColor: string;
  layoutType: "grid" | "list" | "card" | "magazine" | "sidebar" | "accordion" | "bento" | "retro" | "tiles";
  headerStyle: "standard" | "minimal" | "hero";
  darkMode: boolean;
  borderRadius: "sharp" | "rounded" | "pill";
  categoryTabStyle: "pill" | "underline" | "chip";
  templateKey: string;
}

const MenuTemplateSchema = new Schema<IMenuTemplate>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  primaryColor: { type: String, required: true },
  accentColor: { type: String, required: true },
  bgColor: { type: String, default: "#f9fafb" },
  cardBg: { type: String, default: "#ffffff" },
  textColor: { type: String, default: "#111827" },
  layoutType: {
    type: String,
    enum: ["grid", "list", "card", "magazine", "sidebar", "accordion", "bento", "retro", "tiles"],
    required: true,
  },
  headerStyle: {
    type: String,
    enum: ["standard", "minimal", "hero"],
    default: "standard",
  },
  darkMode: { type: Boolean, default: false },
  borderRadius: {
    type: String,
    enum: ["sharp", "rounded", "pill"],
    default: "rounded",
  },
  categoryTabStyle: {
    type: String,
    enum: ["pill", "underline", "chip"],
    default: "pill",
  },
  templateKey: { type: String, default: "classic" },
});

export const MenuTemplate =
  mongoose.models.MenuTemplate ||
  mongoose.model<IMenuTemplate>("MenuTemplate", MenuTemplateSchema);
