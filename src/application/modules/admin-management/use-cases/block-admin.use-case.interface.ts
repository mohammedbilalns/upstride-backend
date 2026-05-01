import type { BlockAdminInput } from "../dtos";

export interface IBlockAdminUseCase {
	execute(input: BlockAdminInput): Promise<void>;
}
