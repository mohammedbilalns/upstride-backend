export interface RequestPasswordResetInput {
	email: string;
}

export interface ChangePasswordInput {
	tempToken: string;
	email: string;
	newPassword: string;
}
