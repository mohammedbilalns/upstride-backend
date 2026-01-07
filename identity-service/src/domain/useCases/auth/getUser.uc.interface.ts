import { UserDTO } from "../../../application/dtos";
import { GetUserDto } from "../../../application/dtos/auth.dto";

export interface IGetUserUC {
	execute(dto: GetUserDto): Promise<UserDTO>;
}
