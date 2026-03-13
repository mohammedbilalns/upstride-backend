import type { ChangePasswordInput } from "../../authentication/dtos/change-password.dto";

export interface IChangePasswordUseCase {
	execute(input: ChangePasswordInput): Promise<void>;
}
