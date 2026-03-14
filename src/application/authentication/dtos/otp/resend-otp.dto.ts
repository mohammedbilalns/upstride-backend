import type { OtpPurpose } from "../../../../domain/policies/otp-purposes";

export interface ResendOtpInput {
	email: string;
	type: OtpPurpose;
}
