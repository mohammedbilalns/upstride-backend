import type { VerifyOtpResponse } from "../../dtos";
import type { VerifyChangePasswordOtpInput } from "../../dtos/otp/verify-change-password-otp.dto";

export interface IVerifyChangePasswordOtpUseCase {
	execute(input: VerifyChangePasswordOtpInput): Promise<VerifyOtpResponse>;
}
