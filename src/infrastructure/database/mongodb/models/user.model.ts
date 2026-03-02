import { model, Schema, type Types } from "mongoose";
import {
	type AuthType,
	AuthTypeValues,
	type UserRole,
	UserRoleValues,
} from "../../../../domain/entities/user.entity";

export interface UserDocument {
	_id: Types.ObjectId;
	name: string;
	email: string;
	phone: string;
	password: string;
	authType: AuthType;
	profilePictureId: string | null;
	role: UserRole;
	isBlocked: boolean;
	isVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export const userSchema = new Schema<UserDocument>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		phone: { type: String, required: true },
		password: { type: String, required: true },
		authType: { type: String, enum: AuthTypeValues, required: true },
		profilePictureId: { type: String },
		role: { type: String, enum: UserRoleValues, required: true },
		isBlocked: { type: Boolean, required: true, default: false },
		isVerified: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true },
);

export const UserModel = model<UserDocument>("User", userSchema);
