import type { RequestChangePasswordInput } from "../../authentication/dtos/request-change-password.dto";

export interface IRequestChangePasswordUseCase {
	execute(input: RequestChangePasswordInput): Promise<void>;
}
