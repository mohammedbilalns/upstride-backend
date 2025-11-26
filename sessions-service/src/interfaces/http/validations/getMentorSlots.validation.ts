import z from "zod";

export const getMentorSlotsParamsSchema = z.object({
	mentorId: z.string(),
});
