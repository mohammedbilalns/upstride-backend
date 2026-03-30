import { z } from "zod";

const objectIdSchema = z
	.string()
	.regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const getAvailableSlotsSchema = {
	params: z.object({
		mentorId: objectIdSchema,
	}),
	query: z.object({
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
	}),
};

export const createBookingSchema = {
	body: z.object({
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
			return date;
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
			return date;
		}),
		paymentType: z.enum(["COINS", "STRIPE"]),
		notes: z.string().optional(),
	}),
};

export const cancelBookingSchema = {
	params: z.object({
		id: objectIdSchema,
	}),
	body: z.object({
		reason: z
			.string()
			.min(5, "Cancellation reason must be at least 5 characters")
			.optional(),
	}),
};

export const bookingListSchema = {
	query: z.object({
		page: z.coerce.number().int().positive().default(1),
		limit: z.coerce
			.number()
			.int()
			.refine((val: number) => [10, 12, 20, 24, 48, 50].includes(val), {
				message: "Limit must be 10, 12, 20, 24, 48 or 50",
			})
			.default(12),
		filter: z.enum(["past", "cancelled", "upcoming", "all"]).default("all"),
	}),
};
