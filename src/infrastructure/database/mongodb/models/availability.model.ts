import { model, Schema, type Types } from "mongoose";
import type {
	Day,
	SlotDuration,
} from "../../../../domain/entities/availability.entity";

export interface BreakTimeDocument {
	startTime: Date;
	endTime: Date;
}

export interface AvailabilityDocument {
	_id: Types.ObjectId;
	mentorId: Types.ObjectId;
	name: string;
	description: string;
	days: Day[];
	startTime: Date;
	endTime: Date;
	startDate: Date;
	endDate: Date;
	breakTimes: BreakTimeDocument[];
	slotDuration: SlotDuration;
	bufferTime: number;
	priority: number;
	status: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const breakTimeSchema = new Schema<BreakTimeDocument>(
	{
		startTime: { type: Date, required: true },
		endTime: { type: Date, required: true },
	},
	{ _id: false },
);

const availabilitySchema = new Schema<AvailabilityDocument>(
	{
		mentorId: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
		name: { type: String, required: true, trim: true },
		description: { type: String, default: "" },
		days: {
			type: [String],
			enum: [
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sunday",
			],
			required: true,
		},
		startTime: { type: Date, required: true },
		endTime: { type: Date, required: true },
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
		breakTimes: { type: [breakTimeSchema], default: [] },
		slotDuration: { type: Number, enum: [30, 60], required: true },
		bufferTime: { type: Number, required: true, min: 0 },
		priority: { type: Number, required: true, min: 0 },
		status: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

availabilitySchema.index({ mentorId: 1, status: 1 });
availabilitySchema.index({ mentorId: 1, priority: -1 });
availabilitySchema.index({ mentorId: 1, startDate: 1, endDate: 1 });

export const AvailabilityModel = model<AvailabilityDocument>(
	"Availability",
	availabilitySchema,
	"availabilities",
);
