import { z } from "zod";

export const bookingIdParamSchema = z.object({
	bookingId: z.string().min(1, "Booking id is required"),
});

export const cancelBookingBodySchema = z.object({
	reason: z
		.string()
		.min(5, "Cancellation reason must be at least 5 characters"),
});

export const bookSessionBodySchema = z.object({
	slotId: z.string().min(1, "Slot id is required"),
});

export const handleRescheduleBodySchema = z.object({
	newSlotId: z.string().min(1, "New slot id is required"),
});

export const bookingListQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce
		.number()
		.int()
		.refine((val: number) => [10, 12, 20, 24, 48, 50].includes(val), {
			message: "Limit must be 10, 12, 20, 24, 48 or 50",
		})
		.default(12),
	filter: z.enum(["past", "cancelled", "upcoming", "all"]).default("all"),
});
