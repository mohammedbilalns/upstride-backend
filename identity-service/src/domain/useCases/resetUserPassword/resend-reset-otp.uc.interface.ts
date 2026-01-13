export interface IResendResetOtpUC {
	execute(email: string): Promise<void>;
}
