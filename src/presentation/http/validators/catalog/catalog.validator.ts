import z from "zod";

export const AddInterestBodySchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be at most 50 characters"),
});

export const AddSkillBodySchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be at most 50 characters"),
	interestId: z.string("Invalid interest ID"),
});

export const AddProfessionBodySchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be at most 50 characters"),
});
