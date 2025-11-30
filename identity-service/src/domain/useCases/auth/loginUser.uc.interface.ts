import { LoginReturn } from "../../../application/dtos/registration.dto";

export interface ILoginUserUC {
	execute(email: string, password: string): Promise<LoginReturn>;
}
