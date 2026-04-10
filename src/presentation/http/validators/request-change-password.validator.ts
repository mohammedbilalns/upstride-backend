import { z } from "zod";

export const RequestChangePasswordBodySchema = z.object({
	oldPassword: z.string().min(1, "Old password is required"),
});

export type RequestChangePasswordBody = z.infer<
	typeof RequestChangePasswordBodySchema
>;
