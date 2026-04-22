import { inject, injectable } from "inversify";
import type {
	IInterestRepository,
	ISkillRepository,
} from "../../../../domain/repositories";
import type { IProfessionRepository } from "../../../../domain/repositories/profession.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { FetchCatalogResponse } from "../dtos/fetch-catalog.dto";
import { FetchCatalogResponseMapper } from "../mappers/fetch-catalog-response.mapper";
import type { IFetchCatalogUseCase } from "./fetch-catalog.use-case.interface";

@injectable()
export class FetchCatalogUseCase implements IFetchCatalogUseCase {
	constructor(
		@inject(TYPES.Repositories.ProfessionRepository)
		private readonly _professionRepository: IProfessionRepository,
		@inject(TYPES.Repositories.InterestRepository)
		private readonly _interestRepository: IInterestRepository,
		@inject(TYPES.Repositories.SkillRepository)
		private readonly _skillRepository: ISkillRepository,
	) {}

	async execute(): Promise<FetchCatalogResponse> {
		const [professions, interests, skills] = await Promise.all([
			this._professionRepository.query({}),
			this._interestRepository.query({}),
			this._skillRepository.query({}),
		]);

		return FetchCatalogResponseMapper.toDto(professions, interests, skills);
	}
}
