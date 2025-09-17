import { Document, Schema, model } from "mongoose";
import { Mentor } from "../../../domain/entities";

export interface IMentor extends Document, Omit<Mentor, "id"> {}
export const mentorSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    bio: { type: String },
    currentRole: { type: String, required: true },
    organisation: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    educationalQualifications: [{ type: String, required: true }],
    personalWebsite: { type: String },
    expertiseId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Expertise",
    },
    skillIds: [{ type: Schema.Types.ObjectId, required: true, ref: "Skill" }],
    resumeId: { type: String, required: true },
    rejectionReason: { type: String },
    blockingReason: { type: String },
    termsAccepted: { type: Boolean, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const mentorModel = model<IMentor>("Mentor", mentorSchema);
