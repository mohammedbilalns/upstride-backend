import { model, Schema, type Types } from "mongoose";

export interface ArticleDocument {
	_id: Types.ObjectId;
	authorId: Types.ObjectId;
	authorSnapshot: {
		name: string;
		avatarUrl: string;
	};
	featuredImageUrl: string;
	title: string;
	description: string;
	previewContent: string;
	tags: string[];
	isActive: boolean;
	views: number;
	commentsCount: number;
	isArchived: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const articleSchema = new Schema<ArticleDocument>(
	{
		authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		authorSnapshot: {
			name: { type: String, required: true },
			avatarUrl: { type: String, required: true },
		},
		featuredImageUrl: { type: String, required: true },
		title: { type: String, required: true },
		description: { type: String, required: true },
		previewContent: { type: String, required: true },
		tags: { type: [String], default: [] },
		isActive: { type: Boolean, required: true, default: true },
		views: { type: Number, required: true, default: 0 },
		commentsCount: { type: Number, required: true, default: 0 },
		isArchived: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true },
);

articleSchema.index({ authorId: 1, createdAt: -1 });
articleSchema.index({ isActive: 1, isArchived: 1, createdAt: -1 });
articleSchema.index({ tags: 1 });

export const ArticleModel = model<ArticleDocument>("Article", articleSchema);
