import type { EnableInterestInput } from "../dtos/enable-interest.dto";

export interface IEnableInterestUseCase {
	execute(input: EnableInterestInput): Promise<void>;
}
