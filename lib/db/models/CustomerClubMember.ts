import mongoose, { Document, Schema } from "mongoose";

export interface ICustomerClubMember extends Document {
  _id: mongoose.Types.ObjectId;
  cafeId: string;
  phoneNumber: string;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerClubMemberSchema = new Schema<ICustomerClubMember>(
  {
    cafeId: { type: String, required: true, index: true },
    phoneNumber: { type: String, required: true },
    joinedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

CustomerClubMemberSchema.index({ cafeId: 1, phoneNumber: 1 }, { unique: true });

export const CustomerClubMember =
  mongoose.models.CustomerClubMember ||
  mongoose.model<ICustomerClubMember>("CustomerClubMember", CustomerClubMemberSchema);
