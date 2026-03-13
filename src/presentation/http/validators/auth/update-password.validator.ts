import { z } from "zod";
import { passwordSchema } from "../common";

export const updatePasswordBodySchema = z.object({
	email: z.email().trim(),
	newPassword: passwordSchema,
});

export type UpdatePasswordBody = z.infer<typeof updatePasswordBodySchema>;
