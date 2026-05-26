import mongoose, { Document, Schema } from "mongoose";

export interface IInventoryItem extends Document {
  _id: mongoose.Types.ObjectId;
  cafeId: string;
  name: string;
  unit: string;
  quantity: number;
  lowThreshold: number;
  cost?: number;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    cafeId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    unit: { type: String, required: true, default: "عدد" },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    lowThreshold: { type: Number, required: true, min: 0, default: 5 },
    cost: { type: Number, min: 0 },
  },
  { timestamps: true }
);

export const InventoryItem =
  mongoose.models.InventoryItem ||
  mongoose.model<IInventoryItem>("InventoryItem", InventoryItemSchema);
