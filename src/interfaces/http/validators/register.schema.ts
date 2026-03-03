import z from "zod";
import { passwordSchema, phoneSchema } from "./common";

export const registerBodySchema = z.object({
	name: z.string().trim().min,
	email: z.email(),
	phone: phoneSchema,
	password: passwordSchema,
});
