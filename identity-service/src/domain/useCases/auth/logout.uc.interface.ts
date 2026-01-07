import { LogoutDto } from "../../../application/dtos/auth.dto";

export interface ILogoutUC {
	execute(dto: LogoutDto): Promise<void>;
}
