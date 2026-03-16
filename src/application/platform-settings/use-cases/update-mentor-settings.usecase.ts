import { inject, injectable } from "inversify";
import type { IPlatformSettingsRepository } from "../../../domain/repositories/platform-settings.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type { PlatformSettingsService } from "../../services/platform-settings.service";
import { NotFoundError } from "../../shared/errors/not-found-error";
import type {
	UpdateMentorSettingsInput,
	UpdateMentorSettingsResponse,
} from "../dtos/update-mentor-settings.dto";
import { PlatformSettingsDtoMapper } from "../mappers/platform-settings.mapper";
import type { IUpdateMentorSettingsUseCase } from "./update-mentor-settings.usecase.interface";

@injectable()
export class UpdateMentorSettingsUseCase
	implements IUpdateMentorSettingsUseCase
{
	constructor(
		@inject(TYPES.Repositories.PlatformSettingsRepository)
		private readonly _platformSettingsRepository: IPlatformSettingsRepository,
		@inject(TYPES.Services.PlatformSettings)
		private readonly _platformSettingsService: PlatformSettingsService,
	) {}

	async execute(
		input: UpdateMentorSettingsInput,
	): Promise<UpdateMentorSettingsResponse> {
		const updated = await this._platformSettingsRepository.updateByType(
			"mentors",
			PlatformSettingsDtoMapper.toMentorSettingsEntity(input.mentors),
		);

		if (!updated) {
			throw new NotFoundError("Platform mentor settings not found");
		}

		await this._platformSettingsService.refresh();

		return {
			mentors: PlatformSettingsDtoMapper.toMentorSettingsDto(updated.data),
		};
	}
}
