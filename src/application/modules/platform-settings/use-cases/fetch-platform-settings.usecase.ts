import { inject, injectable } from "inversify";
import { TYPES } from "../../../../shared/types/types";
import type { PlatformSettingsService } from "../../../services/platform-settings.service";
import type { FetchPlatformSettingsResponse } from "../dtos/fetch-platform-settings.dto";
import { PlatformSettingsDtoMapper } from "../mappers/platform-settings.mapper";
import type { IFetchPlatformSettingsUseCase } from "./fetch-platform-settings.usecase.interface";

@injectable()
export class FetchPlatformSettingsUseCase
	implements IFetchPlatformSettingsUseCase
{
	constructor(
		@inject(TYPES.Services.PlatformSettings)
		private readonly _platformSettingsService: PlatformSettingsService,
	) {}

	async execute(): Promise<FetchPlatformSettingsResponse> {
		await this._platformSettingsService.load();
		const settings = this._platformSettingsService.getAll();
		return PlatformSettingsDtoMapper.toFetchResponse(settings);
	}
}
