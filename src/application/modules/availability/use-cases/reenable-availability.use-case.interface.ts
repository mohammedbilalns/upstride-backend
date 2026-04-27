import type { ReenableAvailabilityInput } from "../dtos/availability.dto";

export interface IReenableAvailabilityUseCase {
	execute(input: ReenableAvailabilityInput): Promise<void>;
}
