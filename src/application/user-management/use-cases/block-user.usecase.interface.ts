import type { BlockUserInput } from "../dtos/block-user.dto";

export interface IBlockUserUseCase {
	execute(input: BlockUserInput): Promise<void>;
}
