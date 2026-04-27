import type { RequestPasswordResetInput } from "../../dtos";

export interface IRequestPasswordResetUseCase {
	execute(input: RequestPasswordResetInput): Promise<void>;
}
