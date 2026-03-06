import { inject, injectable } from "inversify";
import type { IMentorRepository } from "../../../domain/repositories/mentor.repository.interface";
import type { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import { TYPES } from "../../../shared/types/types";
import { MentorApplicationNotFoundError } from "../errors/mentor-application-not-found.error";
import type { IApproveMentorUseCase } from "./approve-mentor.usecase.interface";

@injectable()
export class ApproveMentorUseCase implements IApproveMentorUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly mentorRepository: IMentorRepository,
		@inject(TYPES.Repositories.UserRepository)
		private readonly userRepository: IUserRepository,
	) {}

	async execute(mentorId: string): Promise<void> {
		const mentor = await this.mentorRepository.findById(mentorId);
		if (!mentor) {
			throw new MentorApplicationNotFoundError();
		}

		await this.mentorRepository.approve(mentorId);
		await this.userRepository.updateById(mentor.userId, { role: "MENTOR" });
	}
}
