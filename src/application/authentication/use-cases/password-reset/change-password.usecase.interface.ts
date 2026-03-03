import type { ChangePasswordInput } from "../../dtos/reset-password.dto";

export interface IChangePasswordUseCase {
	execute(input: ChangePasswordInput): Promise<void>;
}
