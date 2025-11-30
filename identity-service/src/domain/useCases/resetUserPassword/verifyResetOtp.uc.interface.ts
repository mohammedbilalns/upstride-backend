export interface IVerifyResetOtpUC {
	execute(email: string, otp: string): Promise<string>;
}
