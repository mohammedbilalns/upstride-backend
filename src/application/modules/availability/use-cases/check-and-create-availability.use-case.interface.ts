import type {
	CheckAndCreateAvailabilityResponse,
	CreateAvailabilityInput,
} from "../dtos/availability.dto";

export interface ICheckAndCreateAvailabilityUseCase {
	execute(
		input: CreateAvailabilityInput,
	): Promise<CheckAndCreateAvailabilityResponse>;
}
