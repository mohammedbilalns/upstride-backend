import type {
	CheckAndReenableAvailabilityResponse,
	ReenableAvailabilityInput,
} from "../dtos/availability.dto";

export interface ICheckAndReenableAvailabilityUseCase {
	execute(
		input: ReenableAvailabilityInput,
	): Promise<CheckAndReenableAvailabilityResponse>;
}
