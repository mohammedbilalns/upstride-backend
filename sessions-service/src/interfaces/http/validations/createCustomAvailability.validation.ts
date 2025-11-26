import z from "zod";

export const createCustomAvailabilityParamsSchema = z.object({
	mentorId: z.string(),
});

export const createCustomAvailabilityPayloadSchema = z.object({
	startAt: z.date(),
	endAt: z.date(),
	slotDuration: z.number(),
});
