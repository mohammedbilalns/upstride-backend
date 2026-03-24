import type { Container } from "inversify";
import {
	FetchPlatformSettingsUseCase,
	type IFetchPlatformSettingsUseCase,
	type IUpdateContentSettingsUseCase,
	type IUpdateEconomySettingsUseCase,
	type IUpdateMentorSettingsUseCase,
	type IUpdateSessionSettingsUseCase,
	UpdateContentSettingsUseCase,
	UpdateEconomySettingsUseCase,
	UpdateMentorSettingsUseCase,
	UpdateSessionSettingsUseCase,
} from "../../application/modules/platform-settings/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerPlatformSettingsBindings = (
	container: Container,
): void => {
	container
		.bind<IFetchPlatformSettingsUseCase>(TYPES.UseCases.FetchPlatformSettings)
		.to(FetchPlatformSettingsUseCase)
		.inSingletonScope();
	container
		.bind<IUpdateEconomySettingsUseCase>(TYPES.UseCases.UpdateEconomySettings)
		.to(UpdateEconomySettingsUseCase)
		.inSingletonScope();
	container
		.bind<IUpdateMentorSettingsUseCase>(TYPES.UseCases.UpdateMentorSettings)
		.to(UpdateMentorSettingsUseCase)
		.inSingletonScope();
	container
		.bind<IUpdateContentSettingsUseCase>(TYPES.UseCases.UpdateContentSettings)
		.to(UpdateContentSettingsUseCase)
		.inSingletonScope();
	container
		.bind<IUpdateSessionSettingsUseCase>(TYPES.UseCases.UpdateSessionSettings)
		.to(UpdateSessionSettingsUseCase)
		.inSingletonScope();
};
