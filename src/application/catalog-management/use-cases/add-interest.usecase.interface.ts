import type { AddInterestInput } from "../dtos/add-interest.dto";

export interface IAddInterestUseCase {
	execute(input: AddInterestInput): Promise<void>;
}
