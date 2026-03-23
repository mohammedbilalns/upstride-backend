import type { ResendOtpInput } from "../dtos";

export interface IResendOtpUseCase {
	execute(input: ResendOtpInput): Promise<void>;
}
