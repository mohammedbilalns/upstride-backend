import type { RevokeAllOtherSessionsInput } from "../../dtos/logout.dto";

export interface IRevokeAllOtherSessionsUseCase {
	execute(input: RevokeAllOtherSessionsInput): Promise<void>;
}
