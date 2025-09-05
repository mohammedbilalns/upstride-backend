import { Document, Schema, model } from "mongoose";
import { Mentor } from "../../../domain/entities";

export interface IMentor extends Document, Omit<Mentor, "id"> {}
export const mentorSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    bio: { type: String },
    currentRole: { type: String, required: true },
    institution: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    educationalQualifications: [{ type: String, required: true }],
    personalWebsite: { type: String, required: true },
    expertiseId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Expertise",
    },
    skillIds: [{ type: Schema.Types.ObjectId, required: true, ref: "Skill" }],
    resumeUrl: { type: String, required: true },
    termsAccepted: { type: Boolean, required: true },
    isApproved: { type: Boolean, Required: true, default: false },
    isRejected: { type: Boolean, Required: true, default: false },
  },
  { timestamps: true },
);

export const mentorModel = model<IMentor>("Mentor", mentorSchema);
