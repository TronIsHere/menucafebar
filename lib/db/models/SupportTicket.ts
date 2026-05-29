import mongoose, { Document, Schema } from "mongoose";
import { connectDB } from "@/lib/db/mongoose";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@/lib/support/constants";

export interface ISupportMessage {
  authorId: string;
  authorRole: "owner" | "admin";
  authorName: string;
  body: string;
  createdAt: Date;
}

export interface ISupportTicket extends Document {
  _id: mongoose.Types.ObjectId;
  ticketNumber: number;
  cafeId: string;
  cafeName: string;
  ownerId: string;
  ownerPhone?: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: string;
  messages: ISupportMessage[];
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SupportMessageSchema = new Schema<ISupportMessage>(
  {
    authorId: { type: String, required: true },
    authorRole: { type: String, enum: ["owner", "admin"], required: true },
    authorName: { type: String, required: true },
    body: { type: String, required: true, maxlength: 5000 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketNumber: { type: Number, required: true, unique: true },
    cafeId: { type: String, required: true, index: true },
    cafeName: { type: String, required: true },
    ownerId: { type: String, required: true, index: true },
    ownerPhone: { type: String },
    subject: { type: String, required: true, maxlength: 200 },
    category: {
      type: String,
      enum: ["general", "technical", "billing", "menu", "orders", "feature"],
      default: "general",
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "waiting", "resolved", "closed"],
      default: "open",
      index: true,
    },
    assignedTo: { type: String },
    messages: { type: [SupportMessageSchema], default: [] },
    lastMessageAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

SupportTicketSchema.index({ cafeId: 1, status: 1, lastMessageAt: -1 });
SupportTicketSchema.index({ status: 1, lastMessageAt: -1 });

export async function getNextTicketNumber(): Promise<number> {
  await connectDB();
  const last = await SupportTicket.findOne()
    .sort({ ticketNumber: -1 })
    .select("ticketNumber")
    .lean();
  return (last?.ticketNumber ?? 1000) + 1;
}

export const SupportTicket =
  mongoose.models.SupportTicket ||
  mongoose.model<ISupportTicket>("SupportTicket", SupportTicketSchema);
