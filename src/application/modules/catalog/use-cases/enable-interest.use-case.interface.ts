import type { EnableInterestInput } from "../dtos/enable-interest.dto";

export interface EnableInterestOutput {
	resourceId: string;
}

export interface IEnableInterestUseCase {
	execute(input: EnableInterestInput): Promise<EnableInterestOutput>;
}
