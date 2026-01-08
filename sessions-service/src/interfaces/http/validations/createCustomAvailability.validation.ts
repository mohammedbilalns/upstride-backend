import z from "zod";

export const createCustomAvailabilityPayloadSchema = z
	.object({
		startAt: z.coerce.date(),
		endAt: z.coerce.date(),
		slotDuration: z.union([
			z.literal(60),
			z.literal(90),
			z.literal(120),
			z.literal(180),
		]),
		price: z.number().min(10).max(10000),
	})
	.refine((data) => data.startAt > new Date(), {
		message: "Start time must be in the future",
		path: ["startAt"],
	})
	.refine((data) => data.endAt > data.startAt, {
		message: "End time must be after start time",
		path: ["endAt"],
	});
