import { inject, injectable } from "inversify";
import type { IMentorProfileReadRepository } from "../../../../domain/repositories/mentor-profile-read.repository.interface";
import type { IReportRepository } from "../../../../domain/repositories/report.repository.interface";
import { PLATFOM_COMMISSION } from "../../../../shared/constants";
import { TYPES } from "../../../../shared/types/types";
import { MentorNotFoundError } from "../../../shared/errors/mentor-not-found.error";
import type {
	GetMentorProfileInput,
	GetMentorProfileResponse,
} from "../dtos/get-mentor-profile.dto";
import { MentorProfileMapper } from "../mappers/mentor-profile.mapper";
import type { IGetMentorProfileUseCase } from "./get-mentor-profile.use-case.interface";

//FIX:  has a side effect that mutates mentor state:
@injectable()
export class GetMentorProfileUseCase implements IGetMentorProfileUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorProfileReadRepository)
		private readonly _mentorProfileReadRepository: IMentorProfileReadRepository,
		@inject(TYPES.Repositories.ReportRepository)
		private readonly _reportRepository: IReportRepository,
	) {}

	async execute({
		userId,
		viewerUserId,
	}: GetMentorProfileInput): Promise<GetMentorProfileResponse> {
		const profile =
			await this._mentorProfileReadRepository.findProfileByUserId(userId);
		if (!profile) {
			throw new MentorNotFoundError();
		}

		const sessionPercentage = PLATFOM_COMMISSION.SESSION_PERCENTAGE;

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
