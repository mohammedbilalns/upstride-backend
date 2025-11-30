import { GoogleAuthResponse } from "../../../application/dtos";

export interface IGoogleAuthenticateUC {
	execute(token: string): Promise<GoogleAuthResponse>;
}
