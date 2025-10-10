import { type Document, model, Schema } from "mongoose";
import { Reaction } from "../../../domain/entities/reaction.entity";

export interface IReaction
	extends Document,
	Omit<Reaction, "id"> {}

export const ReactionSchema: Schema = new Schema(
	{
		resourceId: { type: Schema.Types.ObjectId, ref: "Article" },
		userId: { type: String, required: true },
		reaction: { type: String, required: true },
		createdAt: { type: Date, required: true },
	},
	{
		timestamps: true,
	},
);

export const ReactionModel = model<IReaction>(
	"Reaction",
	ReactionSchema,
);
