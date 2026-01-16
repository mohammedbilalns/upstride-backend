import mongoose, { Schema, Document } from "mongoose";
import { Wallet, OwnerType } from "../../../domain/entities/wallet.entity";

export interface WalletDocument extends Omit<Wallet, "id">, Document { }

const walletSchema = new Schema<WalletDocument>(
    {
        ownerId: {
            type: String,
            required: true,
        },
        ownerType: {
            type: String,
            enum: Object.values(OwnerType),
            required: true,
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
        },
        currency: {
            type: String,
            required: true,
            default: "INR",
        },
    },
    {
        timestamps: true,
    },
);

// Compound index for finding wallet by owner
walletSchema.index({ ownerId: 1, ownerType: 1 }, { unique: true });

export const WalletModel = mongoose.model<WalletDocument>(
    "Wallet",
    walletSchema,
);
