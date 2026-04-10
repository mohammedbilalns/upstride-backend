import { z } from "zod";
import { passwordSchema } from "../../../../shared/validators";

export const LoginBodySchema = z.object({
	email: z.email().trim(),
	password: passwordSchema,
});

export type LoginBody = z.infer<typeof LoginBodySchema>;
