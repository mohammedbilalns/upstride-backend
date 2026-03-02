import { z } from "zod";
import { passwordSchema } from "./password.schema";

export const loginBodySchema = z.object({
	email: z.email(),
	password: passwordSchema,
});
