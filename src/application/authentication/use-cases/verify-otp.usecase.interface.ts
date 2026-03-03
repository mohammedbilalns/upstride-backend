import type { VerifyOtpInput, VerifyOtpResponse } from "../dtos/verify-otp.dto";

export interface IVerifyOtpUseCase {
	execute(input: VerifyOtpInput): Promise<VerifyOtpResponse>;
}
