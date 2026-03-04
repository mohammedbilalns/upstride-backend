import type {
	RefreshSessionInput,
	RefreshSessionOutput,
} from "../../dtos/refresh-session.dto";

export interface IRefreshSessionUseCase {
	execute(input: RefreshSessionInput): Promise<RefreshSessionOutput>;
}
