import { inject, injectable } from "inversify";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { IUserRepository } from "../../../../domain/repositories/user.repository.interface";
import { DEFAULT_SESSION_PRICE_PER_30_MIN } from "../../../../shared/constants";
import { TYPES } from "../../../../shared/types/types";
import type { JobQueuePort } from "../../../ports/job-queue.port";
import type { ApproveMentorInput } from "../dtos/approve-mentor.dto";
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
	) {}

	async execute(input: ApproveMentorInput): Promise<void> {
		const mentor = await this._mentorRepository.findById(input.mentorId);
		if (!mentor) {
			throw new MentorApplicationNotFoundError();
		}

		const user = await this._userRepository.findById(mentor.userId);
		if (!user) {
			return;
		}

		await Promise.all([
			this._mentorRepository.updateById(input.mentorId, {
				isApproved: true,
				isRejected: false,
				rejectionReason: null,
				currentPricePer30Min: DEFAULT_SESSION_PRICE_PER_30_MIN,
			}),
			this._userRepository.updateById(mentor.userId, { role: "MENTOR" }),
		]);

		await this._jobQueue.enqueue("send-mentor-approval-email", {
			to: user.email,
			name: user.name,
		});
	}
}
