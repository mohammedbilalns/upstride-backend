import { Document, model, Schema } from "mongoose";
import { Profession } from "../../../domain/entities/profession.entity";

export interface IProfessionDocument extends Document, Omit<Profession, "id" | "createdAt" | "updatedAt"> {}

const professionSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  fields: [
    {
      key: { type: String, required: true },
      label: { type: String, required: true },
      type: { type: String, enum: ["text", "number", "date", "array", "file", "geo"], required: true },
      required: { type: Boolean, default: false },
      constraints: {
        minLength: Number,
        maxLength: Number,
        pattern: String,
        min: Number,
        max: Number,
        minItems: Number,
        maxItems: Number,
        itemType: { type: String, enum: ["text", "number", "date", "array", "file", "geo"] },
        allowedTypes: [String],
        maxSizeMB: Number,
        minDate: String,
        maxDate: String,
        radiusLimitKM: Number
      }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const professionModel = model<IProfessionDocument>("Profession", professionSchema);