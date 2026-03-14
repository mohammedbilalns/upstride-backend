import { z } from "zod";
import { passwordSchema } from "./common";

export const changePasswordBodySchema = z.object({
	token: z.string().min(1, "Token is required"),
	newPassword: passwordSchema,
});
