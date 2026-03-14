export interface RequestPasswordResetInput {
	email: string;
}

export interface UpdatePasswordInput {
	tempToken: string;
	email: string;
	newPassword: string;
}
