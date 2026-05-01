import type {
	CheckAndUpdateAvailabilityResponse,
	UpdateAvailabilityInput,
} from "../dtos/availability.dto";

export interface ICheckAndUpdateAvailabilityUseCase {
	execute(
		input: UpdateAvailabilityInput,
	): Promise<CheckAndUpdateAvailabilityResponse>;
}
