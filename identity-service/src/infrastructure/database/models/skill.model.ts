import { Document, Schema, model } from "mongoose";
import { Skill } from "../../../domain/entities/skill.entity";

export interface ISkill extends Document, Omit<Skill, "id"> {}

export const skillSchema: Schema = new Schema({
  name: { type: String, required: true, trim:true },
  expertiseId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Expertise",
  },
  isVerified: { type: Boolean, required: true },
});

export const skillModel = model<ISkill>("Skill", skillSchema);
