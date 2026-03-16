import z from "zod";

export const addInterestBodySchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be at most 50 characters"),
});

export const addSkillBodySchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be at most 50 characters"),
	interestId: z.string("Invalid interest ID"),
});

export const addProfessionBodySchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be at most 50 characters"),
});
