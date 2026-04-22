import type { Container } from "inversify";
import {
	AddInterestUseCase,
	AddProfessionUseCase,
	AddSkillUseCase,
	DisableInterestUseCase,
	DisableProfessionUseCase,
	DisableSkillUseCase,
	EnableInterestUseCase,
	EnableProfessionUseCase,
	EnableSkillUseCase,
	FetchCatalogUseCase,
	GetOnboardingCatalogUseCase,
	GetProfessionsUseCase,
	type IAddInterestUseCase,
	type IAddProfessionUseCase,
	type IAddSkillUseCase,
	type IDisableInterestUseCase,
	type IDisableProfessionUseCase,
	type IDisableSkillUseCase,
	type IEnableInterestUseCase,
	type IEnableProfessionUseCase,
	type IEnableSkillUseCase,
	type IFetchCatalogUseCase,
	type IGetOnboardingCatalogUseCase,
	type IGetProfessionsUseCase,
} from "../../application/modules/catalog/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerCatalogBindings = (container: Container): void => {
	container
		.bind<IAddInterestUseCase>(TYPES.UseCases.AddInterest)
		.to(AddInterestUseCase)
		.inSingletonScope();
	container
		.bind<IAddSkillUseCase>(TYPES.UseCases.AddSkill)
		.to(AddSkillUseCase)
		.inSingletonScope();
	container
		.bind<IAddProfessionUseCase>(TYPES.UseCases.AddProfession)
		.to(AddProfessionUseCase)
		.inSingletonScope();
	container
		.bind<IFetchCatalogUseCase>(TYPES.UseCases.FetchCatalog)
		.to(FetchCatalogUseCase)
		.inSingletonScope();
	container
		.bind<IDisableSkillUseCase>(TYPES.UseCases.DisableSkill)
		.to(DisableSkillUseCase)
		.inSingletonScope();
	container
		.bind<IDisableInterestUseCase>(TYPES.UseCases.DisableInterest)
		.to(DisableInterestUseCase)
		.inSingletonScope();
	container
		.bind<IDisableProfessionUseCase>(TYPES.UseCases.DisableProfession)
		.to(DisableProfessionUseCase)
		.inSingletonScope();
	container
		.bind<IGetOnboardingCatalogUseCase>(TYPES.UseCases.GetOnboardingCatalog)
		.to(GetOnboardingCatalogUseCase)
		.inSingletonScope();
	container
		.bind<IGetProfessionsUseCase>(TYPES.UseCases.GetProfessions)
		.to(GetProfessionsUseCase)
		.inSingletonScope();
	container
		.bind<IEnableSkillUseCase>(TYPES.UseCases.EnableSkill)
		.to(EnableSkillUseCase)
		.inSingletonScope();
	container
		.bind<IEnableInterestUseCase>(TYPES.UseCases.EnableInterest)
		.to(EnableInterestUseCase)
		.inSingletonScope();
	container
		.bind<IEnableProfessionUseCase>(TYPES.UseCases.EnableProfession)
		.to(EnableProfessionUseCase)
		.inSingletonScope();
};
