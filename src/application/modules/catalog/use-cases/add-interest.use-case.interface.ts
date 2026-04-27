import type {
	AddInterestInput,
	AddInterestOutput,
} from "../dtos/add-interest.dto";

export interface IAddInterestUseCase {
	execute(input: AddInterestInput): Promise<AddInterestOutput>;
}
