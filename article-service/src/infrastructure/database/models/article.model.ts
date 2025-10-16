import { type Document, model, Schema } from "mongoose";
import type { Article } from "../../../domain/entities/article.entity";

export interface IArticle extends Document, Omit<Article, "id"> {}

export const ArticleSchema: Schema = new Schema<IArticle>(
	{
		authorName: { type: String, required: true },
		authorImage: { type: String },
		featuredImage: { type: String },
		featuredImageId: { type: String },
		title: { type: String, required: true },
		description: { type: String, required: true },
		author: { type: String, required: true },
		tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
		isActive: { type: Boolean, default: true },
		views: { type: Number, default: 0 },
		comments: { type: Number, default: 0 },
		likes: { type: Number, default: 0 },
		isArchived: { type: Boolean, default: false },
		content: { type: String, required: true },
	},
	{
		timestamps: true,
	},
);
ArticleSchema.index({ title: "text", description: "text", content: "text" });

export const ArticleModel = model<IArticle>("Article", ArticleSchema);
