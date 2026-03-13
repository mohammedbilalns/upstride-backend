import { z } from "zod";

export const resendOtpBodySchema = z.object({
	email: z.email(),
});

export type ResendOtpBody = z.infer<typeof resendOtpBodySchema>;
