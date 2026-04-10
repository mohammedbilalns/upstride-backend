import { z } from "zod";
import { passwordSchema } from "../../../shared/validators";

export const changePasswordBodySchema = z.object({
	token: z.string().min(1, "Token is required"),
	newPassword: passwordSchema,
});

export type changePasswordBody = z.infer<typeof changePasswordBodySchema>;
