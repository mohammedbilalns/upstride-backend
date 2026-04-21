import type { LogoutInput } from "../../dtos";

export interface ILogoutUseCase {
	execute(input: LogoutInput): Promise<void>;
}
