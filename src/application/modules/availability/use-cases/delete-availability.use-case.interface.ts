import type { DeleteAvailabilityInput } from "../dtos/availability.dto";

export interface IDeleteAvailabilityUseCase {
	execute(input: DeleteAvailabilityInput): Promise<void>;
}
