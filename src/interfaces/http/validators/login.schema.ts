import { z } from "zod";
import { passwordSchema } from "./common/password.schema";

export const loginBodySchema = z.object({
	email: z.email(),
	password: passwordSchema,
});
