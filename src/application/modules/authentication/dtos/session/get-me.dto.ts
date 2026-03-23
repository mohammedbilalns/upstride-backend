import type { AuthenticatedUserDTO } from "../login/login-with-email.dto";

export interface GetMeInput {
	userId: string;
}

export interface GetMeOutput {
	user: AuthenticatedUserDTO;
}
