import { inject, injectable } from "inversify";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { IUserRepository } from "../../../../domain/repositories/user.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { JobQueuePort } from "../../../ports/job-queue.port";
import type { PlatformSettingsService } from "../../../services/platform-settings.service";
import { MentorApplicationNotFoundError } from "../errors/mentor-application-not-found.error";
import type { IApproveMentorUseCase } from "./approve-mentor.usecase.interface";

@injectable()
export class ApproveMentorUseCase implements IApproveMentorUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorRepository: IMentorWriteRepository,
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.JobQueue)
		private readonly _jobQueue: JobQueuePort,
		@inject(TYPES.Services.PlatformSettings)
		private readonly _platformSettingsService: PlatformSettingsService,
	) {}

	async execute(mentorId: string): Promise<void> {
		const mentor = await this._mentorRepository.findById(mentorId);
		if (!mentor) {
			throw new MentorApplicationNotFoundError();
		}

		const user = await this._userRepository.findById(mentor.userId);
		if (!user) {
			return;
		}

		const starterTier = this._platformSettingsService.mentors.starter;
		await Promise.all([
			this._mentorRepository.updateById(mentorId, {
				isApproved: true,
				isRejected: false,
				rejectionReason: null,
				tierName: starterTier.name,
				tierMax30minPayment: starterTier.maxPricePer30Min,
				currentPricePer30Min: starterTier.maxPricePer30Min,
				score: starterTier.minScore,
			}),
			this._userRepository.updateById(mentor.userId, { role: "MENTOR" }),
		]);

		await this._jobQueue.enqueue("send-mentor-approval-email", {
			to: user.email,
			name: user.name,
		});
	}
}
