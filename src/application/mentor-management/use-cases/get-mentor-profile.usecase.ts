import { inject, injectable } from "inversify";
import type { IMentorRepository } from "../../../domain/repositories/mentor.repository.interface";
import { TYPES } from "../../../shared/types/types";
import { MentorNotFoundError } from "../../mentor-lists/errors";
import type { PlatformSettingsService } from "../../services/platform-settings.service";
import type {
	GetMentorProfileInput,
	GetMentorProfileResponse,
} from "../dtos/get-mentor-profile.dto";
import { MentorProfileMapper } from "../mappers/mentor-profile.mapper";
import type { IGetMentorProfileUseCase } from "./get-mentor-profile.usecase.interface";

@injectable()
export class GetMentorProfileUseCase implements IGetMentorProfileUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
		@inject(TYPES.Services.PlatformSettings)
		private readonly _platformSettingsService: PlatformSettingsService,
	) {}

	async execute({
		userId,
	}: GetMentorProfileInput): Promise<GetMentorProfileResponse> {
		let profile = await this._mentorRepository.findProfileByUserId(userId);
		if (!profile) {
			throw new MentorNotFoundError();
		}

		if (profile.tierName === null || profile.tierMax30minPayment === null) {
			const starterTier = this._platformSettingsService.mentors.starter;
			await this._mentorRepository.updateById(profile.id, {
				tierName: starterTier.name,
				tierMax30minPayment: starterTier.maxPricePer30Min,
				currentPricePer30Min: starterTier.maxPricePer30Min,
			});
			profile = await this._mentorRepository.findProfileByUserId(userId);
			if (!profile) {
				throw new MentorNotFoundError();
			}
		}

		const sessionPercentage =
			this._platformSettingsService.economy.platformCommissions
				.sessionPercentage;
		const mentorSessionEarningPercentage = Math.max(0, 100 - sessionPercentage);

		return {
			profile: MentorProfileMapper.toDto(
				profile,
				mentorSessionEarningPercentage,
			),
		};
	}
}
