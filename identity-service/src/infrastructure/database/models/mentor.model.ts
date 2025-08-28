import { model, Document, Schema } from "mongoose";
import { Mentor } from "../../../domain/entities/mentor.entity";

export interface IMentorDocument
  extends Document,
    Omit<Mentor, "id" | "createdAt" | "updatedAt"> {}

const mentorSchema = new Schema(
  {
    userId: { type: String, required: true },
    expertiseId: {
      type: Schema.Types.ObjectId,
      ref: "Expertise",
      required: true,
    },
    customFields: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
    },
    bio: { type: String },
    experienceInYears: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const mentorModel = model<IMentorDocument>("Expert", mentorSchema);

mentorSchema.index({ expertiseId: 1 });
mentorSchema.index({ userId: 1 });
