import { UserDTO } from "../../../application/dtos";

export interface IGetUserUC {
	execute(userId: string): Promise<UserDTO>;
}
