import type { RefreshSessionInput, RefreshSessionOutput } from "../../dtos";

export interface IRefreshSessionUseCase {
	execute(input: RefreshSessionInput): Promise<RefreshSessionOutput>;
}
