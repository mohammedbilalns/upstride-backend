import { z } from "zod";

export const verifyProfileOtpBodySchema = z.object({
	otp: z.string().min(6, "OTP must be at least 6 characters"),
});

export type VerifyProfileOtpBody = z.infer<typeof verifyProfileOtpBodySchema>;
