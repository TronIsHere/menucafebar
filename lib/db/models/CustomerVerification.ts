import mongoose, { Document, Schema } from "mongoose";

export interface ICustomerVerification extends Document {
  _id: mongoose.Types.ObjectId;
  identifier: string;
  code: string;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerVerificationSchema = new Schema<ICustomerVerification>(
  {
    identifier: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

CustomerVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const CustomerVerification =
  mongoose.models.CustomerVerification ||
  mongoose.model<ICustomerVerification>("CustomerVerification", CustomerVerificationSchema);
