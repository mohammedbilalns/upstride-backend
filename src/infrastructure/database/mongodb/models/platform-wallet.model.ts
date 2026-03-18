import { model, Schema, type Types } from "mongoose";

export interface PlatformWalletDocument {
	_id: Types.ObjectId;
	key: string;
	balance: number;
	createdAt: Date;
	updatedAt: Date;
}

const platformWalletSchema = new Schema<PlatformWalletDocument>(
	{
		key: { type: String, required: true, unique: true, default: "platform" },
		balance: { type: Number, required: true, default: 0 },
	},
	{ timestamps: true },
);

export const PlatformWalletModel = model<PlatformWalletDocument>(
	"PlatformWallet",
	platformWalletSchema,
	"platformwallets",
);
