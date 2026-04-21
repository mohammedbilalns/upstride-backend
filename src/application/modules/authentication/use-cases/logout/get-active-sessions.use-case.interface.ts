import type {
	GetActiveSessionsInput,
	GetActiveSessionsResponse,
} from "../../dtos";

export interface IGetActiveSessionsUseCase {
	execute(
		input: GetActiveSessionsInput,
		currentSessionId: string,
	): Promise<GetActiveSessionsResponse>;
}
