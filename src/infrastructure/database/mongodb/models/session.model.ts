import { model, Schema, type Types } from "mongoose";

export interface SessionDocument {
	_id: Types.ObjectId;
	userId: Types.ObjectId;
	refreshTokenHash: string;
	ipAddress: string;
	userAgent: string;
	deviceName: string;
	deviceType: string;
	revoked: boolean;
	lastUsedAt: Date;
	expiresAt: Date;
	createdAt: Date;
}

export const SessionSchema = new Schema<SessionDocument>(
	{
		userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
		refreshTokenHash: { type: String, required: true },
		ipAddress: { type: String, required: true },
		userAgent: { type: String, required: true },
		deviceName: { type: String, required: true },
		deviceType: { type: String, required: true },
		revoked: { type: Boolean, required: true, default: false },
		lastUsedAt: { type: Date, required: true, default: Date.now },
		expiresAt: { type: Date, required: true },
	},
	{ timestamps: true },
);

export const SessionModel = model<SessionDocument>("Session", SessionSchema);
