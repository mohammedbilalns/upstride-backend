import { z } from "zod";

export const deleteMediaParamsSchema = z.object({
	publicId: z.string().min(1, "PublicId is required"),
	mediaType: z.string().min(1, "MediaType is required"),
});

export const getSignedUrlBodySchema = z.object({
	publicId: z.string().min(1, "PublicId is required"),
	mediaType: z.enum(["raw", "image"], "MediaType is required"),
});

export const uploadMediaBodySchema = z.object({
	resource_type: z.string().min(1, "Resource Type is required").default("auto"),
});
