import type { VerifyOtpResponse } from "../../dtos";
import type { VerifyRegistrationOtpInput } from "../../dtos/otp/verify-registration-otp.dto";

export interface IVerifyRegistrationOtpUseCase {
	execute(input: VerifyRegistrationOtpInput): Promise<VerifyOtpResponse>;
}
