import type { UnblockUserInput } from "../dtos/block-user.dto";

export interface IUnblockUserUseCase {
	execute(input: UnblockUserInput): Promise<void>;
}
