import { z } from "zod";
import { passwordSchema } from "../../../shared/validators";

export const ChangePasswordBodySchema = z.object({
	token: z.string().min(1, "Token is required"),
	newPassword: passwordSchema,
});

export type ChangePasswordBody = z.infer<typeof ChangePasswordBodySchema>;
