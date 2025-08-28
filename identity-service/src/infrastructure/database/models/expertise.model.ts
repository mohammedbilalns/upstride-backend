import { Document, model, Schema } from "mongoose";
import { Expertise } from "../../../domain/entities";

export interface IExpertiseDocument
  extends Document,
    Omit<Expertise, "id" | "createdAt" | "updatedAt"> {}

const expertiseSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    fields: [
      {
        key: { type: String, required: true },
        label: { type: String, required: true },
        type: {
          type: String,
          enum: ["text", "number", "date", "array", "file", "geo"],
          required: true,
        },
        required: { type: Boolean, default: false },
        constraints: {
          minLength: Number,
          maxLength: Number,
          pattern: String,
          min: Number,
          max: Number,
          minItems: Number,
          maxItems: Number,
          itemType: {
            type: String,
            enum: ["text", "number", "date", "array", "file", "geo"],
          },
          allowedTypes: [String],
          maxSizeMB: Number,
          minDate: String,
          maxDate: String,
          radiusLimitKM: Number,
        },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const expertiseModel = model<IExpertiseDocument>(
  "Profession",
  expertiseSchema,
);
