import { type Document, model, Schema } from "mongoose";
import type { ArticleView } from "../../../domain/entities/article-view.entity";

export interface IArticleView extends Document, Omit<ArticleView, "id"> {}

export const ArticleViewSchema: Schema = new Schema(
	{
		articleId: { type: Schema.Types.ObjectId, ref: "Article" },
		userId: { type: String, required: true },
	},
	{
		timestamps: true,
	},
);
ArticleViewSchema.index({ userId: 1, articleId: 1 }, { unique: true });
export const ArticleViewModel = model<IArticleView>(
	"ArticleView",
	ArticleViewSchema,
);
