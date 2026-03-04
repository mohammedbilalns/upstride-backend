import type { LogoutInput } from "../../dtos/logout.dto";

export interface ILogoutUseCase {
	execute(input: LogoutInput): Promise<void>;
}
