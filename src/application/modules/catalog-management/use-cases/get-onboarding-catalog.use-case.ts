import { inject, injectable } from "inversify";
import type {
	IInterestRepository,
	ISkillRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { GetOnboardingCatalogResponse } from "../dtos/get-onboarding-catalog.dto";
import { CatalogResponseMapper } from "../mappers/catalog-response.mapper";
import type { IGetOnboardingCatalogUseCase } from "./get-onboarding-catalog.use-case.interface";

@injectable()
export class GetOnboardingCatalogUseCase
	implements IGetOnboardingCatalogUseCase
{
	constructor(
		@inject(TYPES.Repositories.InterestRepository)
		private readonly _interestRepository: IInterestRepository,
		@inject(TYPES.Repositories.SkillRepository)
		private readonly _skillRepository: ISkillRepository,
	) {}

	async execute(): Promise<GetOnboardingCatalogResponse> {
		const [interests, skills] = await Promise.all([
			this._interestRepository.query({}),
			this._skillRepository.query({}),
		]);

		return CatalogResponseMapper.toDto(interests, skills);
	}
}
