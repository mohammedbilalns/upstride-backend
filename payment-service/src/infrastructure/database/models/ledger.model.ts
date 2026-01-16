import mongoose, { Schema, Document } from "mongoose";
import {
    Ledger,
    TransactionType,
    RelatedEntityType,
} from "../../../domain/entities/ledger.entity";

export interface LedgerDocument extends Omit<Ledger, "id">, Document { }

const ledgerSchema = new Schema<LedgerDocument>(
    {
        walletId: {
            type: String,
            required: true,
            index: true,
        },
        transactionType: {
            type: String,
            enum: Object.values(TransactionType),
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        balance: {
            type: Number,
            required: true,
        },
        relatedEntityId: {
            type: String,
            required: true,
            index: true,
        },
        relatedEntityType: {
            type: String,
            enum: Object.values(RelatedEntityType),
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    },
);

ledgerSchema.index({ walletId: 1, createdAt: -1 });
ledgerSchema.index({ relatedEntityId: 1, relatedEntityType: 1 });

export const LedgerModel = mongoose.model<LedgerDocument>(
    "Ledger",
    ledgerSchema,
);
