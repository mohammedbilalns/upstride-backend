import type { RequestChangePasswordInput } from "../../authentication/dtos";

export interface IRequestChangePasswordUseCase {
	execute(input: RequestChangePasswordInput): Promise<void>;
}
