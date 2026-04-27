import { z } from "zod";
import { passwordSchema } from "../../../shared/validators";

export const RequestChangePasswordBodySchema = z.object({
	oldPassword: passwordSchema,
});

export type RequestChangePasswordBody = z.infer<
	typeof RequestChangePasswordBodySchema
>;
