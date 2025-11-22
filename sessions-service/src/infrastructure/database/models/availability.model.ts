import { Document, model, Schema } from "mongoose";
import { Availability } from "../../../domain/entities/availability.entity";

export interface IAvailability extends Document, Omit<Availability, "id"> {}

export const availabilitySchema: Schema = new Schema(
	{
		mentorId: {
			type: String,
			required: true,
		},
		recurringRules: {
			weekDay: { type: Number, min: 1, max: 7 },
			startTime: { type: Date },
			endTime: { type: Date },
			slotDuration: { type: Number },
			isActve: { type: Boolean },
		},
		customRanges: {
			startAt: { type: Date },
			endAt: { type: Date },
			slotDuration: { type: Number },
			isActve: { type: Boolean },
		},
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
