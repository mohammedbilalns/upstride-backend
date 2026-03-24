import { z } from "zod";
import { otpSchema } from "../../../shared/validators";

export const verifyProfileOtpBodySchema = z.object({
	otp: otpSchema,
});

export type VerifyProfileOtpBody = z.infer<typeof verifyProfileOtpBodySchema>;
