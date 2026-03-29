import { model, Schema, type Types } from "mongoose";
import {
	type ArticleReactionType,
	ArticleReactionTypeValues,
} from "../../../../domain/entities/article-reaction.entity";

export interface ArticleReactionDocument {
	_id: Types.ObjectId;
	resourceId: Types.ObjectId;
	userId: Types.ObjectId;
	reactionType: ArticleReactionType;
	createdAt: Date;
	updatedAt: Date;
}

const articleReactionSchema = new Schema<ArticleReactionDocument>(
	{
		resourceId: { type: Schema.Types.ObjectId, required: true },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		reactionType: {
			type: String,
			enum: ArticleReactionTypeValues,
			required: true,
		},
	},
	{ timestamps: true },
);

articleReactionSchema.index({ resourceId: 1, userId: 1 }, { unique: true });
articleReactionSchema.index({ resourceId: 1, createdAt: -1 });

export const ArticleReactionModel = model<ArticleReactionDocument>(
	"ArticleReaction",
	articleReactionSchema,
);
