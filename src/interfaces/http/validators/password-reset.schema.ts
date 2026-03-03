import z from "zod";

export const passwordResetBodySchema = z.object({
	email: z.email(),
});

export const ResendPasswordResetBodySchema = z.object({
	email: z.string(),
});
