import type {
	AddProfessionInput,
	AddProfessionOutput,
} from "../dtos/add-profession.dto";

export interface IAddProfessionUseCase {
	execute(input: AddProfessionInput): Promise<AddProfessionOutput>;
}
