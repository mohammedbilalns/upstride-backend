import type { UpdateInterestInput } from "../dtos/update-catalog.dto";

export interface IUpdateInterestUseCase {
	execute(input: UpdateInterestInput): Promise<void>;
}
