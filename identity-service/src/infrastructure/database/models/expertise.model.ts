import { Document, Schema, model } from "mongoose";
import { Expertise } from "../../../domain/entities";

export interface IExpertise extends Document, Omit<Expertise, "id"> {}

export const userSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  isVerified: { type: Boolean, required: true },
});

export const expertiseModel = model<IExpertise>("Expertise", userSchema);
