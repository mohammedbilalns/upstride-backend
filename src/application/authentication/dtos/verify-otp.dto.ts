import type { OtpPurpose } from "../../../domain/policies/otp-purposes";

export interface VerifyOtpInput {
	email: string;
	otp: string;
	type: OtpPurpose;
}
