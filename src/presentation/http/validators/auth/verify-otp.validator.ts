import { z } from "zod";
import { otpSchema } from "../../../../shared/validators";

export const VerifyOtpBodySchema = z.object({
	email: z.email(),
	otp: otpSchema,
});

export type VerifyOtpBody = z.infer<typeof VerifyOtpBodySchema>;
