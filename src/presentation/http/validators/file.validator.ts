import { z } from "zod";

export const GetPreSignedUploadUrlBodySchema = z.object({
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
	typeof GetPreSignedUploadUrlBodySchema
>;

export const DeleteFileBodySchema = z.object({
	key: z.string().min(1),
});

export type DeleteFileBodyPayload = z.infer<typeof DeleteFileBodySchema>;
