import type { AuthenticatedUserDTO } from "./login.dto";

export interface GetMeInput {
	usrId: string;
}

export interface GetMeOutput {
	user: AuthenticatedUserDTO;
}
