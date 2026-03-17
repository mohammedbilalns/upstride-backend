import type { DisableInterestInput } from "../dtos/disable-interest.dto";

export interface IDisableInterestUseCase {
	execute(input: DisableInterestInput): Promise<void>;
}
