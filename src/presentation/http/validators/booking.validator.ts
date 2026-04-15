import { z } from "zod";
import {
	buildObjectIdParamSchema,
	isoDateSchema,
	isoDateTimeStringSchema,
	objectIdSchema,
	pageSchema,
} from "../../../shared/validators";

const BookingIdSchema = z.string().min(1, "Booking ID is required");

export const GetAvaialableSlotsParamsSchema =
	buildObjectIdParamSchema("mentorId");

export type GetAvaialableSlotsParams = z.infer<
	typeof GetAvaialableSlotsParamsSchema
>;

export const GetAvailableSlotsQuerySchema = z.object({
	date: isoDateSchema(),
});

export type GetAvailableSlotsQuery = z.infer<
	typeof GetAvailableSlotsQuerySchema
>;

export const CreateBookingBodySchema = z.object({
	mentorId: objectIdSchema,
	startTime: isoDateTimeStringSchema(),
	endTime: isoDateTimeStringSchema(),
	paymentType: z.enum(["COINS", "STRIPE"]),
	notes: z.string().optional(),
});

export type CreateBookingBody = z.infer<typeof CreateBookingBodySchema>;

export const CancellBookingBodySchema = z.object({
	reason: z
		.string()
		.min(5, "Cancellation reason must be at least 5 characters")
		.optional(),
});

export type CancellBookingBody = z.infer<typeof CancellBookingBodySchema>;

export const CancelBookingParamsSchema = z.object({
	id: BookingIdSchema,
});

export type CancelBookingParams = z.infer<typeof CancelBookingParamsSchema>;

export const RepayBookingParamsSchema = z.object({
	id: BookingIdSchema,
});

export type RepayBookingParams = z.infer<typeof RepayBookingParamsSchema>;

export const BookingDetailsParamsSchema = z.object({
	id: BookingIdSchema,
});

export type BookingDetailsParams = z.infer<typeof BookingDetailsParamsSchema>;

export const BookingListQuerySchema = z.object({
	page: pageSchema,
	limit: z.coerce
		.number()
		.int()
		.refine((val: number) => [10, 12, 20, 24, 48, 50].includes(val), {
			message: "Limit must be 10, 12, 20, 24, 48 or 50",
		})
		.default(12),
	filter: z
		.enum([
			"past",
			"completed",
			"cancelled",
			"upcoming_cancelled",
			"past_cancelled",
			"upcoming",
			"all",
			"payment_pending",
		])
		.default("all"),
});

export type BookingListQuery = z.infer<typeof BookingListQuerySchema>;
