import { z } from "zod";
import { passwordSchema } from "./common";

export const changePasswordBodySchema = z.object({
	email: z.email().trim(),
	newPassword: passwordSchema,
});
