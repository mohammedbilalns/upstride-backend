import { type Document, model, Schema } from "mongoose";
import type { Slot } from "../../../domain/entities/slot.entity";

export interface ISlot extends Document, Omit<Slot, "id"> { }

export const slotSchema: Schema = new Schema(
	{
		mentorId: { type: String, required: true },
		description: { type: String },
		startAt: { type: Date, required: true },
		endAt: { type: Date, required: true },
		generatedFrom: { type: Schema.Types.Mixed, default: null },
		ruleId: { type: String, default: null },
		status: {
			type: String,
			enum: ["OPEN", "FULL", "CANCELLED", "STARTED", "COMPLETED", "RESERVED"],
			default: "OPEN",
		},
		price: { type: Number },
		participantId: { type: String },
		cancelledAt: { type: Date, default: null },
		cancelledBy: {
			type: String,
			enum: ["Mentor", "Participant"],
			optional: true,
		},
		cancelReason: { type: String, default: null },
		isActive: { type: Boolean, default: true },
	},
	{
		timestamps: true,
	},
);

export const slotModel = model<ISlot>("Slot", slotSchema);
