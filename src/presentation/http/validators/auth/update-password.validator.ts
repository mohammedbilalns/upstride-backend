import { z } from "zod";
import { passwordSchema } from "../../../../shared/validators";

export const updatePasswordBodySchema = z.object({
	email: z.email().trim(),
	newPassword: passwordSchema,
});

export type UpdatePasswordBody = z.infer<typeof updatePasswordBodySchema>;
