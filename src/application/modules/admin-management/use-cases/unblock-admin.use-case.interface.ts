import type { UnblockAdminInput } from "../dtos";

export interface IUnblockAdminUseCase {
	execute(input: UnblockAdminInput): Promise<void>;
}
