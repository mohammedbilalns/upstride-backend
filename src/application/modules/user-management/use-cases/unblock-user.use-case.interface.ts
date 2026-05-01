import type { UnblockUserInput } from "../dtos/block-user.dto";

export interface UnblockUserOutput {
	resourceId: string;
}

export interface IUnblockUserUseCase {
	execute(input: UnblockUserInput): Promise<UnblockUserOutput>;
}
