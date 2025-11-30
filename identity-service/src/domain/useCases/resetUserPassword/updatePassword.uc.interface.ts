export interface IUpdatePasswordUC {
	execute(
		email: string,
		newPassword: string,
		resetToken: string,
	): Promise<void>;
}
