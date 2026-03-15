import type { AddProfessionInput } from "../dtos/add-profession.dto";

export interface IAddProfessionUseCase {
	execute(input: AddProfessionInput): Promise<void>;
}
