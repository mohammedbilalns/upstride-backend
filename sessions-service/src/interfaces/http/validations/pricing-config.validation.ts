import { z } from "zod";

const pricingTierSchema = z.object({
    duration: z.union([z.literal(30), z.literal(60), z.literal(90)]),
    price: z.number().positive(),
});

export const setPricingConfigSchema = z.object({
    body: z.object({
        pricingTiers: z
            .array(pricingTierSchema)
            .min(1, "At least one pricing tier is required")
            .refine(
                (tiers) => {
                    // Check if sorted by duration
                    for (let i = 0; i < tiers.length - 1; i++) {
                        if (tiers[i].duration >= tiers[i + 1].duration) {
                            return false;
                        }
                    }
                    return true;
                },
                {
                    message: "Pricing tiers must be sorted by duration in ascending order",
                },
            )
            .refine(
                (tiers) => {
                    // Check if shorter sessions don't cost more than longer ones
                    for (let i = 0; i < tiers.length - 1; i++) {
                        if (tiers[i].price > tiers[i + 1].price) {
                            return false;
                        }
                    }
                    return true;
                },
                {
                    message:
                        "Shorter sessions cannot be priced higher than longer sessions",
                },
            ),
        updateExistingSlots: z.boolean().optional(),
    }),
});

export const getMentorPricingSchema = z.object({
    params: z.object({
        mentorId: z.string().min(1, "Mentor ID is required"),
    }),
});
