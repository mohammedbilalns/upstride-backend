import type {
	UpdateInterestInput,
	UpdateInterestOutput,
} from "../dtos/update-catalog.dto";

export interface IUpdateInterestUseCase {
	execute(input: UpdateInterestInput): Promise<UpdateInterestOutput>;
}
