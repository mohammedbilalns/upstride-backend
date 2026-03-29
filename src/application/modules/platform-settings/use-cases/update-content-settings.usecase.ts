import { inject, injectable } from "inversify";
import type { IPlatformSettingsRepository } from "../../../../domain/repositories/platform-settings.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { PlatformSettingsService } from "../../../services/platform-settings.service";
import type {
	UpdateContentSettingsInput,
	UpdateContentSettingsResponse,
} from "../dtos/update-content-settings.dto";
import { PlatformSettingsNotFoundError } from "../errors";
import { PlatformSettingsDtoMapper } from "../mappers/platform-settings.mapper";
import type { IUpdateContentSettingsUseCase } from "./update-content-settings.usecase.interface";

@injectable()
export class UpdateContentSettingsUseCase
	implements IUpdateContentSettingsUseCase
{
	constructor(
		@inject(TYPES.Repositories.PlatformSettingsRepository)
		private readonly _platformSettingsRepository: IPlatformSettingsRepository,
		@inject(TYPES.Services.PlatformSettings)
		private readonly _platformSettingsService: PlatformSettingsService,
	) {}

	async execute(
		input: UpdateContentSettingsInput,
	): Promise<UpdateContentSettingsResponse> {
		const updated = await this._platformSettingsRepository.updateByType(
			"content",
			PlatformSettingsDtoMapper.toContentSettingsEntity(input.content),
		);

		if (!updated) {
			throw new PlatformSettingsNotFoundError("content");
		}

		await this._platformSettingsService.refresh();

		return {
			content: PlatformSettingsDtoMapper.toContentSettingsDto(updated.data),
		};
	}
}
