import { model, Schema, type Types } from "mongoose";

export interface ReviewDocument {
	_id: string;
	mentorId: string;
	userId: Types.ObjectId;
	bookingId: string;
	rating: number;
	comment: string;
	createdAt: Date;
	updatedAt: Date;
}

const ReviewSchema = new Schema<ReviewDocument>(
	{
		_id: { type: String, required: true },
		mentorId: { type: String, required: true, index: true },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		bookingId: { type: String, required: true, unique: true },
		rating: { type: Number, required: true, min: 1, max: 5 },
		comment: { type: String, required: true },
	},
	{ timestamps: true },
);

ReviewSchema.index({ mentorId: 1, createdAt: -1 });

export const ReviewModel = model<ReviewDocument>("Review", ReviewSchema);
