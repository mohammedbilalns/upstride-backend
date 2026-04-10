import { z } from "zod";
import { objectIdSchema } from "../../../shared/validators";

export const MentorListIdParamSchema = z.object({
	listId: z.string().min(1, "List ID is required"),
});
export type MentorListIdParam = z.infer<typeof MentorListIdParamSchema>;

export const MentorIdParamSchema = z.object({
	mentorId: z.string().min(1, "Mentor ID is required"),
});
export type MentorIdParam = z.infer<typeof MentorIdParamSchema>;

export const CreateMentorListBodySchema = z.object({
	name: z
		.string()
		.trim()
		.min(3, "List name must be at least 3 characters")
		.max(50, "List name must be at most 50 characters"),
	description: z
		.string()
		.trim()
		.min(10, "Description must be at least 10 characters")
		.max(100, "Description must be at most 100 characters")
		.optional(),
});
export type CreateMentorListBody = z.infer<typeof CreateMentorListBodySchema>;

export const AddMentorToListBodySchema = z.object({
	mentorId: z.string().min(1, "Mentor ID is required"),
});
export type AddMentorToListBody = z.infer<typeof AddMentorToListBodySchema>;

export const RemoveMentorFromListParamsSchema = z.object({
	listId: objectIdSchema,
	mentorId: objectIdSchema,
});

export type RemoveMentorFromListParams = z.infer<
	typeof RemoveMentorFromListParamsSchema
>;
