import { inject, injectable } from "inversify";
import type { IStorageService } from "../../../application/services/storage.service.interface";
import { MAX_MENTOR_APPLICATION_ATTEMPTS } from "../../../domain/entities/mentor.entity";
import type { IMentorRepository } from "../../../domain/repositories/mentor.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type {
	GetMentorRegistrationInfoInput,
	MentorRegistrationInfoOutput,
} from "../dtos/get-mentor-registration-info.dto";
import { MentorRegistrationResponseMapper } from "../mappers/mentor-registration.mapper";
import type { IGetMentorRegistrationInfoUseCase } from "./get-mentor-registration-info.usecase.interface";

@injectable()
export class GetMentorRegistrationInfoUseCase
	implements IGetMentorRegistrationInfoUseCase
{
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly mentorRepository: IMentorRepository,
		@inject(TYPES.Services.Storage)
		private readonly storageService: IStorageService,
	) {}

	async execute({
		userId,
	}: GetMentorRegistrationInfoInput): Promise<MentorRegistrationInfoOutput> {
		const mentor = await this.mentorRepository.findByUserId(userId);

		const attemptsCount = mentor?.applicationAttempts ?? 0;
		const canApply = attemptsCount < MAX_MENTOR_APPLICATION_ATTEMPTS;

		let resumeUrl: string | null = null;
		if (mentor?.resumeId) {
			resumeUrl = await this.storageService.getSignedUrl(mentor.resumeId);
		}

		return MentorRegistrationResponseMapper.toDto(
			mentor,
			canApply,
			attemptsCount,
			MAX_MENTOR_APPLICATION_ATTEMPTS,
			resumeUrl,
		);
	}
}
