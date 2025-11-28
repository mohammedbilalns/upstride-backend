import { type Document, model, Schema, Types } from "mongoose";
import type { Slot } from "../../../domain/entities/slot.entity";

export interface ISlot extends Document, Omit<Slot, "id"> {}

export const slotSchema: Schema = new Schema(
	{
		mentorId: { type: String, required: true },
		startAt: { type: Date, required: true },
		endAt: { type: Date, required: true },
		generatedFrom: { type: Types.ObjectId, ref: "Availability", default: null },
		status: {
			type: String,
			enum: ["OPEN", "FULL", "CANCELLED", "STARTED", "COMPLETED"],
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
	},
	{
		timestamps: true,
	},
);

export const slotModel = model<ISlot>("Slot", slotSchema);
