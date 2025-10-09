export interface IPasswordResetService {
	initiatePasswordReset(email: string): Promise<void>;
	verifyResetOtp(email: string, otp: string): Promise<string>;
	resendResetOtp(email: string): Promise<void>;
	updatePassword(
		email: string,
		newPassword: string,
		resetToken: string,
	): Promise<void>;
}
