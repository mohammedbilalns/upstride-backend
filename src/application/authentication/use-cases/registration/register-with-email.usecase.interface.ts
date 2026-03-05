import type { RegisterWithEmailInput } from "../../dtos/registration.dto";

export interface IRegisterWithEmailUseCase {
	execute(input: RegisterWithEmailInput): Promise<void>;
}
