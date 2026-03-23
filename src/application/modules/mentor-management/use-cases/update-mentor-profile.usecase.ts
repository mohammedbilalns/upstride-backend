import { inject, injectable } from "inversify";
import type { IMentorProfileReadRepository } from "../../../../domain/repositories/mentor-profile-read.repository.interface";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { PlatformSettingsService } from "../../../services/platform-settings.service";
import { MentorNotFoundError } from "../../../shared/errors/mentor-not-found.error";
import { ValidationError } from "../../../shared/errors/validation-error";
import type {
	UpdateMentorProfileInput,
	UpdateMentorProfileResponse,
} from "../dtos/update-mentor-profile.dto";
import { MentorProfileMapper } from "../mappers/mentor-profile.mapper";
import type { IUpdateMentorProfileUseCase } from "./update-mentor-profile.usecase.interface";

//FIX: remove tier initialization from here
@injectable()
export class UpdateMentorProfileUseCase implements IUpdateMentorProfileUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorWriteRepository: IMentorWriteRepository,
		@inject(TYPES.Repositories.MentorProfileReadRepository)
		private readonly _mentorProfileReadRepository: IMentorProfileReadRepository,
		@inject(TYPES.Services.PlatformSettings)
		private readonly _platformSettingsService: PlatformSettingsService,
	) {}

	async execute({
		userId,
		currentPricePer30Min,
		bio,
		addSkills,
		addEducationalQualifications,
	}: UpdateMentorProfileInput): Promise<UpdateMentorProfileResponse> {
		const mentor = await this._mentorWriteRepository.findByUserId(userId);
		if (!mentor) {
			throw new MentorNotFoundError();
		}

		const updates: Record<string, unknown> = {};
		let tierMaxPrice = mentor.tierMax30minPayment;

		if (tierMaxPrice === null || !mentor.tierName) {
			const starterTier = this._platformSettingsService.mentors.starter;
			updates.tierName = starterTier.name;
			updates.tierMax30minPayment = starterTier.maxPricePer30Min;
			tierMaxPrice = starterTier.maxPricePer30Min;
		}

		if (currentPricePer30Min !== undefined) {
			if (currentPricePer30Min < 100 || currentPricePer30Min > 10000) {
				throw new ValidationError(
					"Current price per 30 min must be between 100 and 10000",
				);
			}

			if (tierMaxPrice !== null && currentPricePer30Min > tierMaxPrice) {
				throw new ValidationError(
					"Current price per 30 min cannot exceed tier max price",
				);
			}

			const maxTierPrice =
				this._platformSettingsService.mentors.expert.maxPricePer30Min;
			if (currentPricePer30Min > maxTierPrice) {
				throw new ValidationError(
					"Current price per 30 min exceeds global maximum tier price",
				);
			}
		}

		if (bio !== undefined) {
			updates.bio = bio;
		}

		if (currentPricePer30Min !== undefined) {
			updates.currentPricePer30Min = currentPricePer30Min;
		}

		if (addEducationalQualifications?.length) {
			const next = [
				...mentor.educationalQualifications,
				...addEducationalQualifications,
			];
			updates.educationalQualifications = next;
		}

		if (addSkills?.length) {
			const existing = new Set(mentor.toolsAndSkills.map((s) => s.skillId));
			const additions = addSkills.filter((s) => !existing.has(s.skillId));
			if (additions.length > 0) {
				updates.toolsAndSkills = [...mentor.toolsAndSkills, ...additions];
			}
		}

		if (Object.keys(updates).length > 0) {
			await this._mentorWriteRepository.updateById(
				mentor.id,
				updates as Partial<Parameters<IMentorWriteRepository["updateById"]>[1]>,
			);
		}

		const profile =
			await this._mentorProfileReadRepository.findProfileByUserId(userId);
		if (!profile) {
			throw new MentorNotFoundError();
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
