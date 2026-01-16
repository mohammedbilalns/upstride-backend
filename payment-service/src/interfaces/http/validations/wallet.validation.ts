import { z } from "zod";

export const getWalletBalanceSchema = z.object({
    query: z.object({
        ownerType: z.enum(["USER", "MENTOR", "PLATFORM"], {
            message: "Invalid ownerType. Must be USER, MENTOR, or PLATFORM",
        }),
    }),
});

export const getTransactionHistorySchema = z.object({
    query: z.object({
        ownerType: z.enum(["USER", "MENTOR", "PLATFORM"], {
            message: "Invalid ownerType. Must be USER, MENTOR, or PLATFORM",
        }),
        limit: z.string().optional().transform((val) => (val ? parseInt(val) : 50)),
        offset: z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val) : 0)),
    }),
});
