import type { ResendOtpInput } from "../dtos/resend-otp.dto";

export interface IResendOtpUseCase {
	execute(input: ResendOtpInput): Promise<void>;
}
