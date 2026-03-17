import { model, Schema, type Types } from "mongoose";
import { CoinTransactionType } from "../../../../domain/entities/coin-transactions.entity";

export interface CoinTransactionDocument {
	_id: Types.ObjectId;
	userId: Types.ObjectId;
	amount: number;
	type: CoinTransactionType;
	referenceType?: string;
	referenceId?: string;
	createdAt: Date;
	updatedAt: Date;
}

export const coinTransactionSchema = new Schema<CoinTransactionDocument>(
	{
		userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
		amount: { type: Number, required: true },
		type: {
			type: String,
			enum: Object.values(CoinTransactionType),
			required: true,
		},
		referenceType: { type: String },
		referenceId: { type: String },
	},
	{ timestamps: true },
);

coinTransactionSchema.index({ userId: 1, createdAt: -1 });
coinTransactionSchema.index({ referenceType: 1, referenceId: 1 });

export const CoinTransactionModel = model<CoinTransactionDocument>(
	"CoinTransaction",
	coinTransactionSchema,
);
