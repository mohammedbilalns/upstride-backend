import { inject, injectable } from "inversify";
import type { IPlatformSettingsRepository } from "../../../domain/repositories/platform-settings.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type { PlatformSettingsService } from "../../services/platform-settings.service";
import { NotFoundError } from "../../shared/errors/not-found-error";
import type {
	UpdateSessionSettingsInput,
	UpdateSessionSettingsResponse,
} from "../dtos/update-session-settings.dto";
import { PlatformSettingsDtoMapper } from "../mappers/platform-settings.mapper";
import type { IUpdateSessionSettingsUseCase } from "./update-session-settings.usecase.interface";

@injectable()
export class UpdateSessionSettingsUseCase
	implements IUpdateSessionSettingsUseCase
{
	constructor(
		@inject(TYPES.Repositories.PlatformSettingsRepository)
		private readonly _platformSettingsRepository: IPlatformSettingsRepository,
		@inject(TYPES.Services.PlatformSettings)
		private readonly _platformSettingsService: PlatformSettingsService,
	) {}

	async execute(
		input: UpdateSessionSettingsInput,
	): Promise<UpdateSessionSettingsResponse> {
		const updated = await this._platformSettingsRepository.updateByType(
			"sessions",
			PlatformSettingsDtoMapper.toSessionSettingsEntity(input.sessions),
		);

		if (!updated) {
			throw new NotFoundError("Platform session settings not found");
		}

		await this._platformSettingsService.refresh();

		return {
			sessions: PlatformSettingsDtoMapper.toSessionSettingsDto(updated.data),
		};
	}
}
