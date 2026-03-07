import z from "zod";

export const passwordResetBodySchema = z.object({
	email: z.email().trim(),
});

export type PasswordResetBody = z.infer<typeof passwordResetBodySchema>;

export const ResendPasswordResetBodySchema = z.object({
	email: z.email().trim(),
});

export type ResendPasswordResetBody = z.infer<
	typeof ResendPasswordResetBodySchema
>;
