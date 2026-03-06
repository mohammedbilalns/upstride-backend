import type { UpdateProfileInput } from "../dtos/update-profile.dto";

export interface IUpdateProfileUseCase {
	execute(input: UpdateProfileInput): Promise<void>;
}
