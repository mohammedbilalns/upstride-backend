import { z } from "zod";
import { passwordSchema } from "../../../../shared/validators";

export const loginBodySchema = z.object({
	email: z.email().trim(),
	password: passwordSchema,
});

export type LoginBody = z.infer<typeof loginBodySchema>;
