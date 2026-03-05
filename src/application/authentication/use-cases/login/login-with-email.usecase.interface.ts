import type { LoginResponse, LoginWithEmailInput } from "../../dtos/login.dto";

export interface ILoginWithEmailUseCase {
	execute(input: LoginWithEmailInput): Promise<LoginResponse>;
}
