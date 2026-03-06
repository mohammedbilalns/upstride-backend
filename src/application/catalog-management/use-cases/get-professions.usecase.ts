import { inject, injectable } from "inversify";
import type { IProfessionRepository } from "../../../domain/repositories/profession.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type { ProfessionDto } from "../dtos/profession.dto";
import { ProfessionResponseMapper } from "../mappers/profession-response.mapper";
import type { IGetProfessionsUseCase } from "./get-professions.usecase.interface";

@injectable()
export class GetProfessionsUseCase implements IGetProfessionsUseCase {
	constructor(
		@inject(TYPES.Repositories.ProfessionRepository)
		private readonly _professionRepository: IProfessionRepository,
	) {}

	async execute(): Promise<ProfessionDto[]> {
		const professions = await this._professionRepository.findAllActive();
		return ProfessionResponseMapper.toDtoList(professions);
	}
}
