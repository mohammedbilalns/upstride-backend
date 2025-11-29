import z from "zod";

export const getMentorRulesParamsSchema = z.object({
	mentorId: z.string(),
});

export const getMentorSlotsParamsSchema = z.object({
	mentorId: z.string(),
});
