export type updatePasswordParam = {
	email: string;
	newPassword: string;
	resetToken: string;
};

export type verifyResetOtpParam = {
	email: string;
	otp: string;
};
