import type { ProfessionDto } from "../dtos/profession.dto";

export interface IGetProfessionsUseCase {
	execute(): Promise<ProfessionDto[]>;
}
