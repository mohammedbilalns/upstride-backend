import type { UpdateProfessionInput } from "../dtos/update-catalog.dto";

export interface IUpdateProfessionUseCase {
	execute(input: UpdateProfessionInput): Promise<void>;
}
