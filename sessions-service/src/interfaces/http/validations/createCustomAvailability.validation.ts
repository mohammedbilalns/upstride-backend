import z from "zod";

export const createCustomAvailabilityPayloadSchema = z.object({
	startAt: z.date(),
	endAt: z.date(),
	slotDuration: z.union([
		z.literal(60),
		z.literal(90),
		z.literal(120),
		z.literal(180),
	]),
});
