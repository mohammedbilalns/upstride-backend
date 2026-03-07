import type { AuthenticatedUserDTO } from "./login.dto";

export interface GetMeInput {
	userId: string;
}

export interface GetMeOutput {
	user: AuthenticatedUserDTO;
}
