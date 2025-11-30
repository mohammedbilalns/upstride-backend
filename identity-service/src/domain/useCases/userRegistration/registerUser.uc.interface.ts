import { registerUserParam } from "../../../application/dtos/registration.dto";

export interface IRegisterUserUC {
	execute(registerUserParam: registerUserParam): Promise<void>;
}
