import { model, Schema, type Types } from "mongoose";

export interface ArticleViewDocument {
	_id: Types.ObjectId;
	articleId: Types.ObjectId;
	userId: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const articleViewSchema = new Schema<ArticleViewDocument>(
	{
		articleId: { type: Schema.Types.ObjectId, ref: "Article", required: true },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{ timestamps: true },
);

articleViewSchema.index({ articleId: 1, userId: 1 }, { unique: true });
articleViewSchema.index({ articleId: 1, createdAt: -1 });

export const ArticleViewModel = model<ArticleViewDocument>(
	"ArticleView",
	articleViewSchema,
);
