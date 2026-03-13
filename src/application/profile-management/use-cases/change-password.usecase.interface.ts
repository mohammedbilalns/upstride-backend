import type { ChangePasswordInput } from "../../authentication/dtos";

export interface IChangePasswordUseCase {
	execute(input: ChangePasswordInput): Promise<void>;
}
