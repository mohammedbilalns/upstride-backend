import type {
	GetProfileInput,
	GetProfileOutput,
} from "../dtos/get-profile.dto";

export interface IGetProfileUseCase {
	execute(input: GetProfileInput): Promise<GetProfileOutput>;
}
