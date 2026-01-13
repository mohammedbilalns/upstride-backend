export interface IVerifyOtpUC {
	execute(email: string, otp: string): Promise<string>;
}
