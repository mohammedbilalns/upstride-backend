import type { GetOnboardingCatalogResponse } from "../dtos/get-onboarding-catalog.dto";

export interface IGetOnboardingCatalogUseCase {
	execute(): Promise<GetOnboardingCatalogResponse>;
}
