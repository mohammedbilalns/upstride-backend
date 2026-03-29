import { inject, injectable } from "inversify";
import type { IMentorProfileReadRepository } from "../../../../domain/repositories/mentor-profile-read.repository.interface";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { IReportRepository } from "../../../../domain/repositories/report.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { PlatformSettingsService } from "../../../services/platform-settings.service";
import { MentorNotFoundError } from "../../../shared/errors/mentor-not-found.error";
import type {
	GetMentorProfileInput,
	GetMentorProfileResponse,
} from "../dtos/get-mentor-profile.dto";
import { MentorProfileMapper } from "../mappers/mentor-profile.mapper";
import type { IGetMentorProfileUseCase } from "./get-mentor-profile.usecase.interface";

//FIX:  has a side effect that mutates mentor state:
@injectable()
export class GetMentorProfileUseCase implements IGetMentorProfileUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorProfileReadRepository)
		private readonly _mentorProfileReadRepository: IMentorProfileReadRepository,
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorWriteRepository: IMentorWriteRepository,
		@inject(TYPES.Repositories.ReportRepository)
		private readonly _reportRepository: IReportRepository,
		@inject(TYPES.Services.PlatformSettings)
		private readonly _platformSettingsService: PlatformSettingsService,
	) {}

	async execute({
		userId,
		viewerUserId,
	}: GetMentorProfileInput): Promise<GetMentorProfileResponse> {
		let profile =
			await this._mentorProfileReadRepository.findProfileByUserId(userId);
		if (!profile) {
			throw new MentorNotFoundError();
		}

		if (profile.tierName === null || profile.tierMax30minPayment === null) {
			const starterTier = this._platformSettingsService.mentors.starter;
			await this._mentorWriteRepository.updateById(profile.id, {
				tierName: starterTier.name,
				tierMax30minPayment: starterTier.maxPricePer30Min,
				currentPricePer30Min: starterTier.maxPricePer30Min,
			});
			profile =
				await this._mentorProfileReadRepository.findProfileByUserId(userId);
			if (!profile) {
				throw new MentorNotFoundError();
			}
		}

		const sessionPercentage =
			this._platformSettingsService.economy.platformCommissions
				.sessionPercentage;
		const mentorSessionEarningPercentage = Math.max(0, 100 - sessionPercentage);

		let isReported = false;
		if (viewerUserId) {
			const activeReports = await this._reportRepository.query({
				query: {
					targetId: userId,
					reporterId: viewerUserId,
					status: "PENDING",
				},
			});
			isReported = activeReports.length > 0;
		}

		return {
			profile: MentorProfileMapper.toDto(
				profile,
				mentorSessionEarningPercentage,
			),
			isReported,
		};
	}
}
