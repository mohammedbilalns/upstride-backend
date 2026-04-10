import { z } from "zod";
import { objectIdSchema } from "../../../shared/validators";

const bookingIdSchema = z.string().min(1, "Booking ID is required");

export const getAvaialableSlotsParamsSchema = z.object({
	mentorId: objectIdSchema,
});

export type getAvaialableSlotsParams = z.infer<
	typeof getAvaialableSlotsParamsSchema
>;

export const getAvailableSlotsQuerySchema = z.object({
	date: z.string().transform((val, ctx) => {
		const date = new Date(val);
		if (isNaN(date.getTime())) {
			ctx.addIssue({
				code: "custom",
				message: "Invalid date format provided for date parameter.",
			});
			return z.NEVER;
		}
		return date;
	}),
});

export type getAvailableSlotsQuery = z.infer<
	typeof getAvailableSlotsQuerySchema
>;

export const createBookingBodySchema = z.object({
	mentorId: objectIdSchema,
	startTime: z.string().transform((val, ctx) => {
		const date = new Date(val);
		if (isNaN(date.getTime())) {
			ctx.addIssue({
				code: "custom",
				message: "Must be a valid ISO 8601 datetime string",
			});
			return z.NEVER;
		}
		return date.toISOString();
	}),
	endTime: z.string().transform((val, ctx) => {
		const date = new Date(val);
		if (isNaN(date.getTime())) {
			ctx.addIssue({
				code: "custom",
				message: "Must be a valid ISO 8601 datetime string",
			});
			return z.NEVER;
		}
		return date.toISOString();
	}),
	paymentType: z.enum(["COINS", "STRIPE"]),
	notes: z.string().optional(),
});

export type createBookingBody = z.infer<typeof createBookingBodySchema>;

export const cancellBookingBodySchema = z.object({
	reason: z
		.string()
		.min(5, "Cancellation reason must be at least 5 characters")
		.optional(),
});

export type cancellBookingBody = z.infer<typeof cancellBookingBodySchema>;

export const cancelBookingParamsSchema = z.object({
	id: bookingIdSchema,
});

export type cancelBookingParams = z.infer<typeof cancelBookingParamsSchema>;

export const repayBookingParamsSchema = z.object({
	id: bookingIdSchema,
});

export type repayBookingParams = z.infer<typeof repayBookingParamsSchema>;

export const bookingDetailsParamsSchema = z.object({
	id: bookingIdSchema,
});

export type bookingDetailsParams = z.infer<typeof bookingDetailsParamsSchema>;

export const bookingListQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce
		.number()
		.int()
		.refine((val: number) => [10, 12, 20, 24, 48, 50].includes(val), {
			message: "Limit must be 10, 12, 20, 24, 48 or 50",
		})
		.default(12),
	filter: z
		.enum(["past", "cancelled", "upcoming", "all", "payment_pending"])
		.default("all"),
});

export type bookingListQuery = z.infer<typeof bookingListQuerySchema>;
