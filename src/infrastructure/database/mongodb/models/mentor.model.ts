import { model, Schema, type Types } from "mongoose";
import {
	type SkillLevel,
	SkillLevelValues,
} from "../../../../domain/entities/user.entity";

export interface MentorDocument {
	_id: Types.ObjectId;
	userId: Types.ObjectId;
	bio: string;
	currentRoleId: Types.ObjectId;
	organization: string;
	yearsOfExperience: number;
	score: number;
	tierName?: string | null;
	tierMax30minPayment?: number | null;
	currentPricePer30Min?: number | null;
	personalWebsite?: string;
	resumeId: string;
	educationalQualifications: string[];
	areasOfExpertise: Types.ObjectId[];
	toolsAndSkills: {
		skillId: Types.ObjectId;
		level: SkillLevel;
	}[];
	experience: {
		company: string;
		role: Types.ObjectId;
		description: string;
		from: Date;
		to: Date | null;
	}[];
	isApproved: boolean;
	applicationAttempts: number;
	isRejected: boolean;
	rejectionReason: string | null;
	avgRating: number;
	isUserBlocked: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const mentorSchema = new Schema<MentorDocument>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		bio: { type: String, required: true },
		currentRoleId: {
			type: Schema.Types.ObjectId,
			ref: "Profession",
			required: true,
		},
		organization: { type: String, required: true },
		yearsOfExperience: { type: Number, required: true },
		score: { type: Number, default: 0 },
		tierName: { type: String },
		tierMax30minPayment: { type: Number },
		currentPricePer30Min: { type: Number },
		personalWebsite: { type: String },
		resumeId: { type: String, required: true },
		educationalQualifications: [{ type: String }],
		areasOfExpertise: {
			type: [{ type: Schema.Types.ObjectId, ref: "Interest" }],
			validate: [
				(val: Types.ObjectId[]) => val.length <= 2,
				"{PATH} exceeds the limit of 2",
			],
		},
		toolsAndSkills: [
			{
				skillId: { type: Schema.Types.ObjectId, ref: "Skill" },
				level: { type: String, enum: SkillLevelValues },
			},
		],
		experience: {
			type: [
				{
					company: { type: String, required: true },
					role: {
						type: Schema.Types.ObjectId,
						ref: "Profession",
						required: true,
					},
					description: { type: String, required: true },
					from: { type: Date, required: true },
					to: { type: Date },
				},
			],
			validate: [
				(val: unknown[]) => val.length <= 7,
				"{PATH} exceeds the limit of 7 items",
			],
		},
		isApproved: { type: Boolean, default: false },
		isRejected: { type: Boolean, default: false },
		avgRating: { type: Number, default: 0 },
		applicationAttempts: {
			type: Number,
			default: 0,
			validate: [
				(val: number) => val <= 3,
				"{PATH} exceeds the limit of 3 attempts",
			],
		},
		rejectionReason: { type: String },
		isUserBlocked: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

mentorSchema.index({ userId: 1 }, { unique: true });
mentorSchema.index({ isApproved: 1 });
mentorSchema.index({ isUserBlocked: 1 });

export const MentorModel = model<MentorDocument>("Mentor", mentorSchema);
