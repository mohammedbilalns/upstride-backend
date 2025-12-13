import z from "zod";

export const cancelSlotParamsSchema = z.object({
	slotId: z.string(),
});
