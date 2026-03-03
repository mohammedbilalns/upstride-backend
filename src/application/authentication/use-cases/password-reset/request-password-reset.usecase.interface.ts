import type { RequestPasswordResetInput } from "../../dtos/reset-password.dto";

export interface IRequestPasswordResetUseCase {
	execute(input: RequestPasswordResetInput): Promise<void>;
}
