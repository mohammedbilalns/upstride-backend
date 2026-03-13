import type { UpdatePasswordInput } from "../../dtos";

export interface IUpdatePasswordUseCase {
	execute(input: UpdatePasswordInput): Promise<void>;
}
