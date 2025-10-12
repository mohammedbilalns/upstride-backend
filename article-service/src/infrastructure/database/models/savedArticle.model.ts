import { type Document, model, Schema } from "mongoose";
import type { SavedArticle } from "../../../domain/entities/savedArticle.entity";

export interface ISavedArticle extends Document, Omit<SavedArticle, "id"> {}

export const savedArticleSchema: Schema = new Schema(
	{
		userId: { type: String, required: true },
		articleId: { type: Schema.Types.ObjectId, ref: "Article", required: true },
	},
	{
		timestamps: true,
	},
);

export const SavedArticleModel = model<ISavedArticle>(
	"SavedArticle",
	savedArticleSchema,
);
