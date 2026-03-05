import type {
	GetActiveSessionsInput,
	GetActiveSessionsResponse,
} from "../../dtos/get-active-sessions.dto";

export interface IGetActiveSessionsUseCase {
	execute(
		input: GetActiveSessionsInput,
		currentSessionId: string,
	): Promise<GetActiveSessionsResponse>;
}
