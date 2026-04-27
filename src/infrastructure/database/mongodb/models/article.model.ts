import { model, Schema, type Types } from "mongoose";

export interface ArticleDocument {
	_id: Types.ObjectId;
	authorId: Types.ObjectId;
	authorSnapshot: {
		name: string;
		interestIds: Types.ObjectId[];
		avatarUrl?: string;
		isBlocked?: boolean;
	};
	slug: string;
	featuredImageUrl: string;
	title: string;
	description: string;
	previewContent: string;
	tags: string[];
	isActive: boolean;
	views: number;
	commentsCount: number;
	likesCount: number;
	isArchived: boolean;
	isBlockedByAdmin: boolean;
	blockingReason: string | null;
	blockedAt: Date | null;
	blockedByReportId: Types.ObjectId | null;
	createdAt: Date;
	updatedAt: Date;
}

const articleSchema = new Schema<ArticleDocument>(
	{
		authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		authorSnapshot: {
			name: { type: String, required: true },
			interestIds: [
				{ type: Schema.Types.ObjectId, ref: "Interest", default: [] },
			],
			avatarUrl: { type: String },
			isBlocked: { type: Boolean, default: false },
		},
		slug: { type: String, required: true, unique: true },
		featuredImageUrl: { type: String, default: "" },
		title: { type: String, required: true },
		description: { type: String, required: true },
		previewContent: { type: String, required: true },
		tags: [{ type: String }],
		isActive: { type: Boolean, required: true, default: true },
		views: { type: Number, required: true, default: 0 },
		commentsCount: { type: Number, required: true, default: 0 },
		likesCount: { type: Number, required: true, default: 0 },
		isArchived: { type: Boolean, required: true, default: false },
		isBlockedByAdmin: { type: Boolean, default: false },
		blockingReason: { type: String, default: null },
		blockedAt: { type: Date, default: null },
		blockedByReportId: {
			type: Schema.Types.ObjectId,
			ref: "Report",
			default: null,
		},
	},
	{ timestamps: true },
);

articleSchema.index({ authorId: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ createdAt: -1 });

export const ArticleModel = model<ArticleDocument>("Article", articleSchema);
