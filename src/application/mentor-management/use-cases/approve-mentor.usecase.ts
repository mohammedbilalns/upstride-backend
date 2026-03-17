import { inject, injectable } from "inversify";
import { MentorApprovalMailTemplate } from "../../../domain/mail/mentor-approval-mail.template";
import type { IMentorRepository } from "../../../domain/repositories/mentor.repository.interface";
import type { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type { IMailService } from "../../services/mail.service.interface";
import type { PlatformSettingsService } from "../../services/platform-settings.service";
import { MentorApplicationNotFoundError } from "../errors/mentor-application-not-found.error";
import type { IApproveMentorUseCase } from "./approve-mentor.usecase.interface";

@injectable()
export class ApproveMentorUseCase implements IApproveMentorUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly mentorRepository: IMentorRepository,
		@inject(TYPES.Repositories.UserRepository)
		private readonly userRepository: IUserRepository,
		@inject(TYPES.Services.MailService)
		private readonly mailService: IMailService,
		@inject(TYPES.Services.PlatformSettings)
		private readonly platformSettingsService: PlatformSettingsService,
	) {}

	async execute(mentorId: string): Promise<void> {
		const mentor = await this.mentorRepository.findById(mentorId);
		if (!mentor) {
			throw new MentorApplicationNotFoundError();
		}

		const user = await this.userRepository.findById(mentor.userId);
		if (!user) {
			return;
		}

		const baseTierId = String(
			this.platformSettingsService.mentors.starter.level,
		);

		await this.mentorRepository.approve(mentorId, baseTierId);
		await this.userRepository.updateById(mentor.userId, { role: "MENTOR" });

		await this.mailService.send(user.email, new MentorApprovalMailTemplate(), {
			name: user.name,
		});
	}
}
