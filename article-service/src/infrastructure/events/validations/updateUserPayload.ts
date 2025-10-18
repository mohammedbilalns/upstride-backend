import z from "zod";

export const updateUserPayloadSchema = z.object({
	userId: z.string().trim(),
	name: z.string().trim(),
	profilePicture: z.string().trim(),
})
