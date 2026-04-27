export interface VerifyResetPasswordOtpInput {
	email: string;
	otp: string;
}

export interface VerifyResetPasswordOtpResponse {
	setupToken: string;
}
