export interface VerifyRegistrationOtpInput {
	email: string;
	otp: string;
}

export interface VerifyRegistrationOtpResponse {
	setupToken: string;
}
