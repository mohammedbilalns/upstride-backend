import { LoginUserDto, LoginReturn } from "../../../application/dtos/auth.dto";

export interface ILoginUserUC {
	execute(dto: LoginUserDto): Promise<LoginReturn>;
}
