import { z } from "zod";

export const requestChangePasswordBodySchema = z.object({
	oldPassword: z.string().min(1, "Old password is required"),
});

export type RequestChangePasswordBody = z.infer<
	typeof requestChangePasswordBodySchema
>;
