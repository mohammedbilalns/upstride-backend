import z from "zod";

export const changePasswordSchema = z.object({
	oldPassword: z.string().min(8).max(100).trim(),
	newPassword: z.string().min(8).max(100).trim(),
})

export const fetchProfileSchema = z.object({
	profileId: z.string(),
})
