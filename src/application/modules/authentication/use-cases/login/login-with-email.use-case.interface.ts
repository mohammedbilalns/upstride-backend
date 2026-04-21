import type { LoginResponse, LoginWithEmailInput } from "../../dtos";

export interface ILoginWithEmailUseCase {
	execute(input: LoginWithEmailInput): Promise<LoginResponse>;
}
