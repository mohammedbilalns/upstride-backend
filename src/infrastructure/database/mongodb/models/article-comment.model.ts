import { model, Schema, type Types } from "mongoose";

export interface ArticleCommentDocument {
	_id: Types.ObjectId;
	articleId: Types.ObjectId;
	parentId?: Types.ObjectId | null;
	userId: Types.ObjectId;
	likesCount: number;
	repliesCount: number;
	content: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const articleCommentSchema = new Schema<ArticleCommentDocument>(
	{
		articleId: { type: Schema.Types.ObjectId, ref: "Article", required: true },
		parentId: { type: Schema.Types.ObjectId, ref: "ArticleComment" },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		likesCount: { type: Number, required: true, default: 0 },
		repliesCount: { type: Number, required: true, default: 0 },
		content: { type: String, required: true },
		isActive: { type: Boolean, required: true, default: true },
	},
	{ timestamps: true },
);

articleCommentSchema.index({ articleId: 1, createdAt: -1 });
articleCommentSchema.index({ articleId: 1, parentId: 1, createdAt: -1 });
articleCommentSchema.index({ userId: 1, createdAt: -1 });

export const ArticleCommentModel = model<ArticleCommentDocument>(
	"ArticleComment",
	articleCommentSchema,
);
