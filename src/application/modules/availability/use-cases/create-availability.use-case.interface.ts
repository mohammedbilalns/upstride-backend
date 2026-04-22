import type {
	CreateAvailabilityInput,
	CreateAvailabilityResponse,
} from "../dtos/availability.dto";

export interface ICreateAvailabilityUseCase {
	execute(input: CreateAvailabilityInput): Promise<CreateAvailabilityResponse>;
}
