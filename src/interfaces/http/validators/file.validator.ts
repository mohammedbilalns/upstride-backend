import { z } from "zod";

export const getPreSignedUploadUrlSchema = z.object({
	fileName: z.string().min(1),
	mimetype: z.string().min(1),
	category: z.enum(["resume", "profile-picture"]),
});

export type GetPreSignedUploadUrlPayload = z.infer<
	typeof getPreSignedUploadUrlSchema
>;

export const deleteFileSchema = z.object({
	key: z.string().min(1),
});
