import { inject, injectable } from "inversify";
import type { IPlatformSettingsRepository } from "../../../domain/repositories/platform-settings.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type { PlatformSettingsService } from "../../services/platform-settings.service";
import { NotFoundError } from "../../shared/errors/not-found-error";
import type {
	UpdateEconomySettingsInput,
	UpdateEconomySettingsResponse,
} from "../dtos/update-economy-settings.dto";
import { PlatformSettingsDtoMapper } from "../mappers/platform-settings.mapper";
import type { IUpdateEconomySettingsUseCase } from "./update-economy-settings.usecase.interface";

@injectable()
export class UpdateEconomySettingsUseCase
	implements IUpdateEconomySettingsUseCase
{
	constructor(
		@inject(TYPES.Repositories.PlatformSettingsRepository)
		private readonly _platformSettingsRepository: IPlatformSettingsRepository,
		@inject(TYPES.Services.PlatformSettings)
		private readonly _platformSettingsService: PlatformSettingsService,
	) {}

	async execute(
		input: UpdateEconomySettingsInput,
	): Promise<UpdateEconomySettingsResponse> {
		const updated = await this._platformSettingsRepository.updateByType(
			"economy",
			PlatformSettingsDtoMapper.toEconomySettingsEntity(input.economy),
		);

		if (!updated) {
			throw new NotFoundError("Platform economy settings not found");
		}

		await this._platformSettingsService.refresh();

		return {
			economy: PlatformSettingsDtoMapper.toEconomySettingsDto(updated.data),
		};
	}
}
