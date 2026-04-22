import type { UnblockAdminInput } from "../dtos/block-admin.dto";

export interface IUnblockAdminUseCase {
	execute(input: UnblockAdminInput): Promise<void>;
}
