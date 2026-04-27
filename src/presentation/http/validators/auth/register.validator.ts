import z from "zod";
import {
	nameSchema,
	passwordSchema,
	phoneSchema,
} from "../../../../shared/validators";

export const RegisterBodySchema = z.object({
	name: nameSchema,
	email: z.email().trim(),
	phone: phoneSchema,
	password: passwordSchema,
});

export type RegisterBody = z.infer<typeof RegisterBodySchema>;
