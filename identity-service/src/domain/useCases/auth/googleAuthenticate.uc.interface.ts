import { GoogleAuthResponse, GoogleAuthDto } from "../../../application/dtos";

export interface IGoogleAuthenticateUC {
	execute(dto: GoogleAuthDto): Promise<GoogleAuthResponse>;
}
