import type { ResendRegistrationOtpInput } from "../../dtos/otp/resend-registration-otp.dto";

export interface IResendRegistrationOtpUseCase {
	execute(input: ResendRegistrationOtpInput): Promise<void>;
}
