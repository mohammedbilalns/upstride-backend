import { model, Schema, type Types } from "mongoose";
import type { BookingStatus } from "../../../../domain/entities/booking.entity";

export interface BookingDocument {
	_id: Types.ObjectId;
	mentorId: Types.ObjectId;
	menteeId: Types.ObjectId;
	startTime: Date;
	endTime: Date;
	status: BookingStatus;
	meetingLink: string;
	notes: string | null;
	createdAt: Date;
	updatedAt: Date;
}

const bookingSchema = new Schema<BookingDocument>(
	{
		mentorId: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
		menteeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		startTime: { type: Date, required: true },
		endTime: { type: Date, required: true },
		status: {
			type: String,
			enum: [
				"CANCELLED_BY_MENTEE",
				"CANCELLED_BY_MENTOR",
				"CONFIRMED",
				"PENDING",
				"COMPLETED",
			],
			default: "PENDING",
		},
		meetingLink: { type: String, default: "" },
		notes: { type: String, default: null },
	},
	{ timestamps: true },
);

bookingSchema.index({ menteeId: 1, createdAt: -1 });
bookingSchema.index({ mentorId: 1, createdAt: -1 });
bookingSchema.index({ mentorId: 1, startTime: 1, endTime: 1 });

export const BookingModel = model<BookingDocument>(
	"Booking",
	bookingSchema,
	"bookings",
);
