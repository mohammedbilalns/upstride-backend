import type {
	GetMentorAvailabilitiesInput,
	GetMentorAvailabilitiesResponse,
} from "../dtos/availability.dto";

export interface IGetMentorAvailabilitiesUseCase {
	execute(
		input: GetMentorAvailabilitiesInput,
	): Promise<GetMentorAvailabilitiesResponse>;
}
