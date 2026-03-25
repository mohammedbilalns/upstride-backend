import { z } from "zod";

export const getPreSignedUploadUrlBodySchema = z.object({
	fileName: z.string().min(1),
	mimetype: z.string().min(1),
	category: z.enum([
		"resume",
		"profile-picture",
		"chat-media",
		"article-featured-image",
	]),
});

export type GetPreSignedUploadUrlBody = z.infer<
	typeof getPreSignedUploadUrlBodySchema
>;

export const deleteFileBodySchema = z.object({
	key: z.string().min(1),
});

export type DeleteFileBodyPayload = z.infer<typeof deleteFileBodySchema>;
