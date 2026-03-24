import type { VerifyOtpResponse } from "../../dtos";
import type { VerifyResetPasswordOtpInput } from "../../dtos/otp/verify-reset-password-otp.dto";

export interface IVerifyResetPasswordOtpUseCase {
	execute(input: VerifyResetPasswordOtpInput): Promise<VerifyOtpResponse>;
}
