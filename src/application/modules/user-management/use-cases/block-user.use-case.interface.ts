import type { BlockUserInput } from "../dtos/block-user.dto";

export interface BlockUserOutput {
	resourceId: string;
}

export interface IBlockUserUseCase {
	execute(input: BlockUserInput): Promise<BlockUserOutput>;
}
