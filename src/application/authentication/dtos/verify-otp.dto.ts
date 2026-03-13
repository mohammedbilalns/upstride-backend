import type { OtpPurpose } from "../../../domain/policies/otp-purposes";
import type { LoginResponse } from "./login.dto";

export interface VerifyOtpInput {
	email: string;
	otp: string;
	type: OtpPurpose;
	deviceType?: string;
	deviceVendor?: string;
	deviceModel?: string;
	deviceOs?: string;
	ipAddress?: string;
	userAgent?: string;
}

interface VerifyResetOtpResponse {
	resetToken: string | null;
}

interface VerifyRegisterOtpResponse {
	setupToken: string;
}

interface VerifyChangePasswordOtpResponse {
	resetToken: string;
}

export type VerifyOtpResponse =
	| VerifyResetOtpResponse
	| VerifyRegisterOtpResponse
	| VerifyChangePasswordOtpResponse
	| LoginResponse;
