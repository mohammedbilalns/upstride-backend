
import { model, Document, Schema } from "mongoose";
import { Professional } from "../../../domain/entities/proffessional.entity";

export interface IProfessionalDocument extends Document, Omit<Professional, "id" | "createdAt" | "updatedAt"> {}

const professionalSchema = new Schema({
  userId: { type: String, required: true },
  professionId: { type: Schema.Types.ObjectId, ref: "Profession", required: true },
  customFields: Object,
  status: { type: String, enum: ["pending", "approved", "rejected"], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const professionalModel = model<IProfessionalDocument>("Professional", professionalSchema); 