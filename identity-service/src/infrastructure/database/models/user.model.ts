import { type Document, model, Schema } from "mongoose";
import type { User } from "../../../domain/entities/user.entity";

export interface IUser extends Document, Omit<User, "id"> {}

export const userSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		phone: { type: String },
		profilePicture: { type: String },
		profilePictureId: { type: String },
		isBlocked: { type: Boolean, default: false },
		googleId: { type: String },
		isVerified: { type: Boolean, default: false },
		isRequestedForMentoring: {
			type: String,
			enum: ["pending", "approved", "rejected"],
		},
		mentorRejectionReason: { type: String },
		mentorRegistrationCount: { type: Number, default: 0 },
		passwordHash: { type: String },
		role: {
			type: String,
			enum: ["user", "mentor", "admin", "superadmin"],
			default: "user",
		},
		interestedExpertises: [{ type: Schema.Types.ObjectId, ref: "Expertise" }],
		interestedSkills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
	},
	{ timestamps: true },
);
userSchema.index({ email: 1, role: 1 });

export const userModel = model<IUser>("User", userSchema);
