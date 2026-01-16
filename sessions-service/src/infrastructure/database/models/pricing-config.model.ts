import mongoose, { Schema, Document } from "mongoose";
import {
    PricingConfig,
    PricingTier,
} from "../../../domain/entities/pricing-config.entity";

export interface PricingConfigDocument
    extends Omit<PricingConfig, "id">,
    Document { }

const pricingTierSchema = new Schema<PricingTier>(
    {
        duration: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    { _id: false },
);

const pricingConfigSchema = new Schema<PricingConfigDocument>(
    {
        mentorId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        pricingTiers: {
            type: [pricingTierSchema],
            required: true,
            validate: {
                validator: function (tiers: PricingTier[]) {
                    // Validate that tiers are sorted by duration
                    for (let i = 0; i < tiers.length - 1; i++) {
                        if (tiers[i].duration >= tiers[i + 1].duration) {
                            return false;
                        }
                        // Validate that longer sessions don't cost less
                        if (tiers[i].price > tiers[i + 1].price) {
                            return false;
                        }
                    }
                    return true;
                },
                message:
                    "Pricing tiers must be sorted by duration and shorter sessions cannot cost more than longer ones",
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

export const PricingConfigModel = mongoose.model<PricingConfigDocument>(
    "PricingConfig",
    pricingConfigSchema,
);
