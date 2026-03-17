import { model, Schema, type Types } from "mongoose";

export interface SessionSlotDocument {
	_id: Types.ObjectId;
	mentorId: Types.ObjectId;
	startTime: Date;
	endTime: Date;
	durationMinutes: number;
	price: number;
	currency: "coins";
	status: "available" | "booked" | "blocked";
	bookingId?: Types.ObjectId | null;
	createdFromRuleId?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

const sessionSlotSchema = new Schema<SessionSlotDocument>(
	{
		mentorId: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
		startTime: { type: Date, required: true },
		endTime: { type: Date, required: true },
		durationMinutes: { type: Number, required: true },
		price: { type: Number, required: true },
		currency: { type: String, enum: ["coins"], default: "coins" },
		status: {
			type: String,
			enum: ["available", "booked", "blocked"],
			default: "available",
		},
		bookingId: { type: Schema.Types.ObjectId, ref: "SessionBooking" },
		createdFromRuleId: { type: String },
	},
	{ timestamps: true },
);

sessionSlotSchema.index({ mentorId: 1, startTime: 1 });

export const SessionSlotModel = model<SessionSlotDocument>(
	"SessionSlot",
	sessionSlotSchema,
	"sessionslot",
);
