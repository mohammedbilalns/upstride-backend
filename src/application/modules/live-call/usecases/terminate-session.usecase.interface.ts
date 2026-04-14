import type { TerminateSessionInput } from "../dtos/terminate-session.dto";

export interface ITerminateSessionUseCase {
	execute(input: TerminateSessionInput): Promise<void>;
}
