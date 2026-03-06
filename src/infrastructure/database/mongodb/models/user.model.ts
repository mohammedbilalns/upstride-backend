import { model, Schema, type Types } from "mongoose";
import {
	type AuthType,
	AuthTypeValues,
	type SkillLevel,
	SkillLevelValues,
	type UserRole,
	UserRoleValues,
} from "../../../../domain/entities/user.entity";

export interface UserDocument {
	_id: Types.ObjectId;
	name: string;
	email: string;
	phone?: string;
	passwordHash: string;
	authType: AuthType;
	profilePictureId: string | null;
	role: UserRole;
	isBlocked: boolean;
	isVerified: boolean;
	preferences?: {
		interests: Types.ObjectId[];
		skills: {
			skillId: Types.ObjectId;
			level: SkillLevel;
		}[];
	};
	createdAt: Date;
	updatedAt: Date;
}

export const userSchema = new Schema<UserDocument>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		phone: { type: String },
		passwordHash: { type: String, required: true },
		authType: { type: String, enum: AuthTypeValues, required: true },
		profilePictureId: { type: String },
		role: { type: String, enum: UserRoleValues, required: true },
		isBlocked: { type: Boolean, required: true, default: false },
		isVerified: { type: Boolean, required: true, default: false },
		preferences: {
			interests: [{ type: Schema.Types.ObjectId, ref: "Interest" }],
			skills: [
				{
					skillId: { type: Schema.Types.ObjectId, ref: "Skill" },
					level: {
						type: String,
						enum: SkillLevelValues,
					},
				},
			],
		},
	},
	{ timestamps: true },
);

export const UserModel = model<UserDocument>("User", userSchema);
