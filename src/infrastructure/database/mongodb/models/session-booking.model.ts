import { model, Schema, type Types } from "mongoose";

export interface SessionBookingDocument {
	_id: Types.ObjectId;
	userId: Types.ObjectId;
	mentorId: Types.ObjectId;
	slotId: Types.ObjectId;
	startTime: Date;
	endTime: Date;
	price: number;
	status: "pending" | "confirmed" | "cancelled" | "completed" | "refunded";
	payment: {
		coinsDebited: number;
		transactionId: Types.ObjectId;
	};
	meeting: {
		roomId?: string;
		joinUrl?: string;
	};
	cancellationReason?: string | null;
	cancelledBy?: "user" | "mentor" | null;
	createdAt: Date;
	updatedAt: Date;
}

const sessionBookingSchema = new Schema<SessionBookingDocument>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		mentorId: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
		slotId: { type: Schema.Types.ObjectId, ref: "SessionSlot", required: true },
		startTime: { type: Date, required: true },
		endTime: { type: Date, required: true },
		price: { type: Number, required: true },
		status: {
			type: String,
			enum: ["pending", "confirmed", "cancelled", "completed", "refunded"],
			default: "pending",
		},
		payment: {
			coinsDebited: { type: Number, required: true },
			transactionId: {
				type: Schema.Types.ObjectId,
				ref: "CoinTransaction",
				required: true,
			},
		},
		meeting: {
			roomId: { type: String },
			joinUrl: { type: String },
		},
		cancellationReason: { type: String },
		cancelledBy: { type: String, enum: ["user", "mentor"] },
	},
	{ timestamps: true },
);

sessionBookingSchema.index({ userId: 1, createdAt: -1 });
sessionBookingSchema.index({ mentorId: 1, createdAt: -1 });

export const SessionBookingModel = model<SessionBookingDocument>(
	"SessionBooking",
	sessionBookingSchema,
	"sessionbookings",
);
