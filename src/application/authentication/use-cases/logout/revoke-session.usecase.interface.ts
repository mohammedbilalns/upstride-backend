import type { RevokeSessionInput } from "../../dtos/session/logout.dto";

export interface IRevokeSessionUseCase {
	execute(input: RevokeSessionInput): Promise<void>;
}
