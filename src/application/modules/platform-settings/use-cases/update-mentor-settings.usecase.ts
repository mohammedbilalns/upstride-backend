import { inject, injectable } from "inversify";
import type { IPlatformSettingsRepository } from "../../../../domain/repositories/platform-settings.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { PlatformSettingsService } from "../../../services/platform-settings.service";
import { NotFoundError } from "../../../shared/errors/not-found-error";
import { ValidationError } from "../../../shared/errors/validation-error";
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
		const existing =
			await this._platformSettingsRepository.findByType("mentors");
		if (!existing) {
			throw new NotFoundError("Platform mentor settings not found");
		}

		const current = PlatformSettingsDtoMapper.toMentorSettingsDto(
			existing.data,
		);
		const incoming = input.mentors;

		const tiers = [
			{ key: "starter", label: "Starter" },
			{ key: "rising", label: "Rising" },
			{ key: "expert", label: "Expert" },
		] as const;

		for (const tier of tiers) {
			const currentTier = current[tier.key];
			const incomingTier = incoming[tier.key];

			if (
				currentTier.level !== incomingTier.level ||
				currentTier.name !== incomingTier.name ||
				currentTier.minScore !== incomingTier.minScore ||
				currentTier.maxScore !== incomingTier.maxScore
			) {
				throw new ValidationError(
					`Only max price per 30 min can be updated for ${tier.label} tier.`,
				);
			}
		}

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
