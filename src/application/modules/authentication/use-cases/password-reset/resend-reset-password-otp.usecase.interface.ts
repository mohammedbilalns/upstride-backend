import type { ResendResetPasswordOtpInput } from "../../dtos/otp/resend-reset-password-otp.dto";

export interface IResendResetPasswordOtpUseCase {
	execute(input: ResendResetPasswordOtpInput): Promise<void>;
}
