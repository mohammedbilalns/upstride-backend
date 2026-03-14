import type { Container } from "inversify";
import {
	GetOnboardingCatalogUseCase,
	GetProfessionsUseCase,
} from "../../application/catalog-management/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerCatalogBindings = (container: Container): void => {
	container
		.bind<GetOnboardingCatalogUseCase>(TYPES.UseCases.GetOnboardingCatalog)
		.to(GetOnboardingCatalogUseCase)
		.inSingletonScope();
	container
		.bind<GetProfessionsUseCase>(TYPES.UseCases.GetProfessions)
		.to(GetProfessionsUseCase)
		.inSingletonScope();
};
