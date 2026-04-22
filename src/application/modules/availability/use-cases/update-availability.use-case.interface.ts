import type {
	UpdateAvailabilityInput,
	UpdateAvailabilityResponse,
} from "../dtos/availability.dto";

export interface IUpdateAvailabilityUseCase {
	execute(input: UpdateAvailabilityInput): Promise<UpdateAvailabilityResponse>;
}
