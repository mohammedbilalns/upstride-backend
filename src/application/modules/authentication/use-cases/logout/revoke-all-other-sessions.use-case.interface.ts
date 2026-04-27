import type { RevokeAllOtherSessionsInput } from "../../dtos/session/logout.dto";

export interface IRevokeAllOtherSessionsUseCase {
	execute(input: RevokeAllOtherSessionsInput): Promise<void>;
}
