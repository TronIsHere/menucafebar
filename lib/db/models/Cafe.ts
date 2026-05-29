import mongoose, { Document, Schema } from "mongoose";

export interface ICafe extends Document {
  _id: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  logoUrl?: string;
  openTime: string;
  closeTime: string;
  fridayOpenTime: string;
  fridayCloseTime: string;
  ownerId: string;
  templateKey?: string;
  tableNumbers: string[];
  kitchenAutoPrint: boolean;
  printerPaperWidth: "58" | "80";
  customerClubDiscountEnabled: boolean;
  newCustomerDiscountPercent: number;
  isOnboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CafeSchema = new Schema<ICafe>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    logoUrl: { type: String },
    openTime: { type: String, required: true, default: "08:00" },
    closeTime: { type: String, required: true, default: "22:00" },
    fridayOpenTime: { type: String, required: true, default: "08:00" },
    fridayCloseTime: { type: String, required: true, default: "22:00" },
    ownerId: { type: String, required: true, index: true },
    templateKey: { type: String },
    tableNumbers: { type: [String], default: [] },
    kitchenAutoPrint: { type: Boolean, default: true },
    printerPaperWidth: { type: String, enum: ["58", "80"], default: "80" },
    customerClubDiscountEnabled: { type: Boolean, default: false },
    newCustomerDiscountPercent: { type: Number, default: 10, min: 0, max: 100 },
    isOnboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Cafe =
  mongoose.models.Cafe || mongoose.model<ICafe>("Cafe", CafeSchema);
