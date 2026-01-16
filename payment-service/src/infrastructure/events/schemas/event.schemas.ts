import { z } from "zod";

// Booking Cancelled Event Schema
export const bookingCancelledEventSchema = z.object({
    bookingId: z.string(),
    userId: z.string(),
    mentorId: z.string(),
    totalAmount: z.number().positive(),
    refundBreakdown: z.object({
        userAmount: z.number().nonnegative(),
        mentorAmount: z.number().nonnegative(),
        platformAmount: z.number().nonnegative(),
        userPercentage: z.number().min(0).max(1),
        mentorPercentage: z.number().min(0).max(1),
        platformPercentage: z.number().min(0).max(1),
    }),
    hoursUntilSession: z.number(),
});

export type BookingCancelledEvent = z.infer<typeof bookingCancelledEventSchema>;
