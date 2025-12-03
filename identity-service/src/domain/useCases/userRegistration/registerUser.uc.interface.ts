import { registerUserParam } from "../../../application/dtos/registration.dto";

export interface IRegisterUserUC {
	execute(dto: registerUserParam): Promise<void>;
}
