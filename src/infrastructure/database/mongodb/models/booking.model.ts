import { model, Schema, type Types } from "mongoose";
import type {
	BookingStatus,
	PaymentStatus,
	PaymentType,
} from "../../../../domain/entities/booking.entity";

export interface BookingDocument {
	_id: string;
	mentorId: Types.ObjectId;
	menteeId: Types.ObjectId;
	startTime: Date;
	endTime: Date;
	status: BookingStatus;
	meetingLink: string;
	paymentType: PaymentType;
	paymentStatus: PaymentStatus;
	totalAmount: number;
	currency: string;
	notes: string | null;
	settledAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

const bookingSchema = new Schema<BookingDocument>(
	{
		_id: { type: String, required: true },
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
				"SLOT_TAKEN_BY_ANOTHER_USER",
				"STARTED",
				"COMPLETED",
			],
			default: "PENDING",
		},
		paymentType: { type: String, enum: ["COINS", "STRIPE"], required: true },
		paymentStatus: {
			type: String,
			enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
			default: "PENDING",
		},
		totalAmount: { type: Number, required: true },
		currency: { type: String, required: true },
		meetingLink: { type: String, default: "" },
		notes: { type: String, default: null },
		settledAt: { type: Date, default: null },
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
