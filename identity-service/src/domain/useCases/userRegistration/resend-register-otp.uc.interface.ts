export interface IResendRegisterOtpUC {
	execute(email: string): Promise<void>;
}
