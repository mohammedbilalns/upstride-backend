import { inject, injectable } from "inversify";
import type { IMentorProfileReadRepository } from "../../../../domain/repositories/mentor-profile-read.repository.interface";
import type { IReportRepository } from "../../../../domain/repositories/report.repository.interface";

import { TYPES } from "../../../../shared/types/types";
import type { IStorageService } from "../../../services/storage.service.interface";
import { MentorNotFoundError } from "../../../shared/errors/mentor-not-found.error";
import { ValidationError } from "../../../shared/errors/validation-error";
import type {
	GetPublicMentorProfileInput,
	GetPublicMentorProfileResponse,
} from "../dtos/get-public-mentor-profile.dto";
import { MentorPublicProfileMapper } from "../mappers/mentor-public-profile.mapper";
import type { IGetPublicMentorProfileUseCase } from "./get-public-mentor-profile.usecase.interface";

@injectable()
export class GetPublicMentorProfileUseCase
	implements IGetPublicMentorProfileUseCase
{
	constructor(
		@inject(TYPES.Repositories.MentorProfileReadRepository)
		private readonly _mentorProfileReadRepository: IMentorProfileReadRepository,

		@inject(TYPES.Repositories.ReportRepository)
		private readonly _reportRepository: IReportRepository,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute({
		mentorId,
		requesterUserId,
		requesterRole,
	}: GetPublicMentorProfileInput): Promise<GetPublicMentorProfileResponse> {
		const isAdmin =
			requesterRole === "ADMIN" || requesterRole === "SUPER_ADMIN";

		let profile =
			await this._mentorProfileReadRepository.findProfileById(mentorId);

		if (!profile) {
			profile =
				await this._mentorProfileReadRepository.findProfileByUserId(mentorId);
		}

		if (!profile) {
			throw new MentorNotFoundError();
		}

		if (
			!isAdmin &&
			(!profile.isApproved || profile.isRejected || profile.isUserBlocked)
		) {
			throw new MentorNotFoundError();
		}

		if (!isAdmin && profile.userId === requesterUserId) {
			throw new ValidationError(
				"Mentor cannot access their own public profile",
			);
		}

		const avatar = profile.user.profilePictureId
			? this._storageService.getPublicUrl(profile.user.profilePictureId)
			: undefined;

		let isReported = false;
		if (requesterUserId) {
			const activeReports = await this._reportRepository.query({
				query: {
					targetId: profile.userId,
					reporterId: requesterUserId,
					status: "PENDING",
				},
			});
			isReported = activeReports.length > 0;
		}

		return {
			profile: MentorPublicProfileMapper.toDto(profile, avatar),
			isReported,
		};
	}
}
