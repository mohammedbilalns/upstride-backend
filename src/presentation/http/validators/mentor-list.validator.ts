import { z } from "zod";

export const MentorListIdParamSchema = z.object({
	listId: z.string().min(1, "List ID is required"),
});

export const MentorIdParamSchema = z.object({
	mentorId: z.string().min(1, "Mentor ID is required"),
});

export const CreateMentorListBodySchema = z.object({
	name: z.string().trim().min(1, "List name is required").max(100),
	description: z.string().trim().max(500).optional(),
});

export const AddMentorToListBodySchema = z.object({
	mentorId: z.string().min(1, "Mentor ID is required"),
});
