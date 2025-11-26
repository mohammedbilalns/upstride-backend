import z from "zod";

export const cancelSlotParamsSchema = z.object({
	mentorId: z.string(),
	slotId: z.string(),
});
