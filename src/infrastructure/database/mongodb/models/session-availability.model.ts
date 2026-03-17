import { model, Schema, type Types } from "mongoose";

export interface SessionAvailabilityDocument {
	_id: Types.ObjectId;
	mentorId: Types.ObjectId;
	recurringRules: {
		ruleId: string;
		weekDay: number;
		startTime: number;
		endTime: number;
		slotDuration: number;
		isActive?: boolean;
	}[];
	createdAt: Date;
	updatedAt: Date;
}

const sessionAvailabilitySchema = new Schema<SessionAvailabilityDocument>(
	{
		mentorId: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
		recurringRules: [
			{
				ruleId: { type: String, required: true },
				weekDay: { type: Number, required: true, min: 0, max: 6 },
				startTime: { type: Number, required: true, min: 0 },
				endTime: { type: Number, required: true, min: 0 },
				slotDuration: { type: Number, enum: [30, 60], required: true },
				isActive: { type: Boolean, default: true },
			},
		],
	},
	{ timestamps: true },
);

sessionAvailabilitySchema.index({ mentorId: 1 }, { unique: true });

export const SessionAvailabilityModel = model<SessionAvailabilityDocument>(
	"SessionAvailability",
	sessionAvailabilitySchema,
	"sessionAvailablity",
);
