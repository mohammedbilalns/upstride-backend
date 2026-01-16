import { z } from "zod";

export const refundProcessedEventSchema = z.object({
    bookingId: z.string(),
    userId: z.string(),
    refundAmount: z.number().positive(),
});

export type RefundProcessedEvent = z.infer<typeof refundProcessedEventSchema>;
