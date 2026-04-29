import type {
	UpdateProfessionInput,
	UpdateProfessionOutput,
} from "../dtos/update-catalog.dto";

export interface IUpdateProfessionUseCase {
	execute(input: UpdateProfessionInput): Promise<UpdateProfessionOutput>;
}
