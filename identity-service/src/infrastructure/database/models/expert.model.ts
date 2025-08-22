
import { model, Document, Schema } from "mongoose";
import { Expert } from "../../../domain/entities/expert.entity";

export interface IExpertDocument extends Document, Omit<Expert, "id" | "createdAt" | "updatedAt"> {}

const expertSchema = new Schema({
  userId: { type: String, required: true },
  professionId: { type: Schema.Types.ObjectId, ref: "Profession", required: true },
  customFields: Object,
  status: { type: String, enum: ["pending", "approved", "rejected"], required: true },
}, { timestamps: true });

export const expertModel = model<IExpertDocument>("Expert", expertSchema); 
