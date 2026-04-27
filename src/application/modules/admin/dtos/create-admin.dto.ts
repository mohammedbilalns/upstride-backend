export interface CreateAdminInput {
	email: string;
	password: string;
}

export interface CreateAdminOutput {
	newAdminId: string;
}
