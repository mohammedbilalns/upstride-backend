import type { RevokeSessionInput } from "../../dtos/logout.dto";

export interface IRevokeSessionUseCase {
	execute(input: RevokeSessionInput): Promise<void>;
}
