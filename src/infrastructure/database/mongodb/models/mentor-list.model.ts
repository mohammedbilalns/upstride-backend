import { model, Schema, type Types } from "mongoose";

export interface MentorListDocument {
	_id: Types.ObjectId;
	userId: Types.ObjectId;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

export const mentorListSchema = new Schema<MentorListDocument>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		name: { type: String, required: true },
	},
	{ timestamps: true },
);

mentorListSchema.index({ userId: 1, createdAt: -1 });

export const MentorListModel = model<MentorListDocument>(
	"MentorList",
	mentorListSchema,
);
