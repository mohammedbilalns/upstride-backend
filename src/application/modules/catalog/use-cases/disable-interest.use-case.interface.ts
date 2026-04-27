import type { DisableInterestInput } from "../dtos/disable-interest.dto";

export interface DisableInterestOutput {
	resourceId: string;
}

export interface IDisableInterestUseCase {
	execute(input: DisableInterestInput): Promise<DisableInterestOutput>;
}
