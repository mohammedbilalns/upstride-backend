import type { VerifyOtpInput, VerifyOtpResponse } from "../dtos";

export interface IVerifyOtpUseCase {
	execute(input: VerifyOtpInput): Promise<VerifyOtpResponse>;
}
