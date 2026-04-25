import { model, Schema, type Types } from "mongoose";

export interface ReviewDocument {
	_id: string;
	userId: Types.ObjectId;
	bookingId: Types.ObjectId;
	rating: number;
	comment: string;
}

const ReviewSchema = new Schema<ReviewDocument>({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
	rating: { type: Number, required: true },
	comment: { type: String, required: true },
});

export const ReviewModel = model<ReviewDocument>("Review", ReviewSchema);
