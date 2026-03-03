import type { VerifyOtpInput } from "../dtos/verify-otp.dto";

export interface IVerifyOtpUseCase {
	execute(input: VerifyOtpInput): Promise<void>;
}
