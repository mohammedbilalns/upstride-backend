import { BlockUserDto } from "../../../application/dtos/user.dto";

export interface IBlockUserUC {
	execute(dto: BlockUserDto): Promise<void>;
}
