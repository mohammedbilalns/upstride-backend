import { UnblockUserDto } from "../../../application/dtos/user.dto";

export interface IUnblockUserUC {
	execute(dto: UnblockUserDto): Promise<void>;
}
