import { z } from "zod";

export const verifyOtpBodySchema = z.object({
	email: z.email(),
	otp: z.string().min(6, "OTP must be at least 6 characters"),
});

export type VerifyOtpBody = z.infer<typeof verifyOtpBodySchema>;
