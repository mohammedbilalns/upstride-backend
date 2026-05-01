import type { BlockAdminInput } from "../dtos/block-admin.dto";

export interface IBlockAdminUseCase {
	execute(input: BlockAdminInput): Promise<void>;
}
