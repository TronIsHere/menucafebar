import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  cafeId: string;
  items: IOrderItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  source: "customer" | "waiter";
  isPaid: boolean;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  subtotal?: number;
  discountPercent?: number;
  discountAmount?: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuItemId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    note: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    cafeId: { type: String, required: true, index: true },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "completed", "cancelled"],
      default: "pending",
    },
    source: { type: String, enum: ["customer", "waiter"], required: true },
    isPaid: { type: Boolean, default: false },
    tableNumber: { type: String },
    customerName: { type: String },
    customerPhone: { type: String },
    subtotal: { type: Number, min: 0 },
    discountPercent: { type: Number, min: 0, max: 100 },
    discountAmount: { type: Number, min: 0 },
    note: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ cafeId: 1, createdAt: -1 });
OrderSchema.index({ cafeId: 1, status: 1, createdAt: -1 });

export const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
