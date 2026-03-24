import z from "zod";
import { passwordSchema, phoneSchema } from "../../../../shared/validators";

export const registerBodySchema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters"),
	email: z.email().trim(),
	phone: phoneSchema,
	password: passwordSchema,
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
