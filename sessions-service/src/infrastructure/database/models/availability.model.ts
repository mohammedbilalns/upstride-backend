import { type Document, model, Schema } from "mongoose";
import type { Availability } from "../../../domain/entities/availability.entity";

export interface IAvailability extends Document, Omit<Availability, "id"> {}

export const availabilitySchema: Schema = new Schema(
	{
		mentorId: {
			type: String,
			required: true,
		},
		recurringRules: [
			{
				ruleId: { type: String, required: true },
				weekDay: { type: Number, min: 1, max: 7 },
				startTime: { type: Date },
				endTime: { type: Date },
				slotDuration: { type: Number },
				isActive: { type: Boolean, default: true },
			},
		],
		exceptionRanges: [
			{
				startAt: { type: Date },
				endAt: { type: Date },
			},
		],
		price: { type: Number },
	},
	{ timestamps: true },
);

export const availabilityModel = model<IAvailability>(
	"Availability",
	availabilitySchema,
);
