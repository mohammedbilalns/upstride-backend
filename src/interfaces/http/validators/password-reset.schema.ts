import z from "zod";

export const passwordResetBodySchema = z.object({
	email: z.email(),
});
