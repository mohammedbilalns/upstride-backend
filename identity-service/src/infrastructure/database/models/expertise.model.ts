import { type Document, model, Schema } from "mongoose";
import type { Expertise } from "../../../domain/entities";

export interface IExpertise extends Document, Omit<Expertise, "id"> {}

export const userSchema: Schema = new Schema({
	name: {
		type: String,
		required: true,
		unique: [true, "Expertise with the same name already exists"],
	},
	description: { type: String, required: true },
	isVerified: { type: Boolean, required: true },
});

export const expertiseModel = model<IExpertise>("Expertise", userSchema);
