import type { RegisterWithEmailInput } from "../../dtos";

export interface IRegisterWithEmailUseCase {
	execute(input: RegisterWithEmailInput): Promise<void>;
}
