import { inject, injectable } from "inversify";
import {
	MAX_MENTOR_APPLICATION_ATTEMPTS,
	Mentor,
} from "../../../../domain/entities/mentor.entity";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import type { ResubmitMentorInput } from "../dtos/resubmit-mentor.dto";
import { MaxApplicationAttemptsExceededError } from "../errors/max-application-attempts-exceeded.error";
import type { IResubmitMentorUseCase } from "./resubmit-mentor.use-case.interface";

@injectable()
export class ResubmitMentorUseCase implements IResubmitMentorUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorRepository: IMentorWriteRepository,
	) {}

	async execute(input: ResubmitMentorInput): Promise<void> {
		const existingMentor = await getMentorByUserIdOrThrow(
			this._mentorRepository,
			input.userId,
			"Mentor profile not found",
		);

		if (existingMentor.applicationAttempts >= MAX_MENTOR_APPLICATION_ATTEMPTS) {
			throw new MaxApplicationAttemptsExceededError();
		}

		const resumeId = input.resumeId ?? existingMentor.resumeId;
		const educationalQualifications =
			input.educationalQualifications ??
			existingMentor.educationalQualifications;
		const areasOfExpertise =
			input.areasOfExpertise ?? existingMentor.areasOfExpertise;

		const updatedMentor = new Mentor(
			existingMentor.id,
			input.userId,
			input.bio ?? existingMentor.bio,
			input.currentRoleId ?? existingMentor.currentRoleId,
			input.organization ?? existingMentor.organization,
			input.yearsOfExperience ?? existingMentor.yearsOfExperience,
			existingMentor.score,
			existingMentor.tierName ?? null,
			existingMentor.tierMax30minPayment ?? null,
			existingMentor.currentPricePer30Min ?? null,
			input.personalWebsite ?? existingMentor.personalWebsite,
			resumeId,
			educationalQualifications,
			areasOfExpertise,
			input.toolsAndSkills
				? input.toolsAndSkills.map((ts) => ({
						skillId: ts.skillId as string,
						level: ts.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
					}))
				: existingMentor.toolsAndSkills,
			input.experience
				? input.experience.map((exp) => ({
						company: exp.company as string,
						role: exp.role as string,
						description: exp.description as string,
						from: new Date(exp.from as string),
						to: exp.to ? new Date(exp.to) : null,
					}))
				: existingMentor.experience,
			false,
			existingMentor.isRejected
				? existingMentor.applicationAttempts + 1
				: existingMentor.applicationAttempts,
			existingMentor.skippedSessionsCount,
			false,
			existingMentor.createdAt,
			new Date(),
			null,
			existingMentor.avgRating,
		);

		await this._mentorRepository.updateById(existingMentor.id, updatedMentor);
	}
}
