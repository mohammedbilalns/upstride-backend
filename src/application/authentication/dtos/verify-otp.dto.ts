import type { OtpPurpose } from "../../../domain/policies/otp-purposes";
import type { LoginResponse } from "./login.dto";

export interface VerifyOtpInput {
	email: string;
	otp: string;
	type: OtpPurpose;
}

interface VerifyResetOtpResponse {
	resetToken: string | null;
}

export type VerifyOtpResponse = VerifyResetOtpResponse | LoginResponse;
