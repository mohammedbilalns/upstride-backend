import type { JoinSessionInput } from "../dtos/join-session.dto";

export interface IValidateJoinSessionUseCase {
	execute(input: JoinSessionInput): Promise<void>;
}
