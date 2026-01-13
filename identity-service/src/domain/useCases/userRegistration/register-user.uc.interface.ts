import { RegisterUserDto } from "../../../application/dtos/registration.dto";

export interface IRegisterUserUC {
	execute(dto: RegisterUserDto): Promise<void>;
}
