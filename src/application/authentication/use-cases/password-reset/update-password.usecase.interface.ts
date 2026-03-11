import type { UpdatePasswordInput } from "../../dtos/reset-password.dto";

export interface IUpdatePasswordUseCase {
	execute(input: UpdatePasswordInput): Promise<void>;
}
