import { inject, injectable } from "inversify";
import {
	MAX_MENTOR_APPLICATION_ATTEMPTS,
	Mentor,
} from "../../../domain/entities/mentor.entity";
import type { IMentorRepository } from "../../../domain/repositories/mentor.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type { ResubmitMentorInput } from "../dtos/resubmit-mentor.dto";
import { MaxApplicationAttemptsExceededError } from "../errors/max-application-attempts-exceeded.error";
import type { IResubmitMentorUseCase } from "./resubmit-mentor.usecase.interface";

@injectable()
export class ResubmitMentorUseCase implements IResubmitMentorUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly mentorRepository: IMentorRepository,
	) {}

	async execute(input: ResubmitMentorInput): Promise<void> {
		const existingMentor = await this.mentorRepository.findByUserId(
			input.userId,
		);

		if (!existingMentor) {
			throw new Error("Mentor profile not found.");
		}

		if (existingMentor.applicationAttempts >= MAX_MENTOR_APPLICATION_ATTEMPTS) {
			throw new MaxApplicationAttemptsExceededError();
		}

		const updatedMentor = new Mentor(
			existingMentor.id,
			input.userId,
			input.bio ?? existingMentor.bio,
			input.currentRoleId ?? existingMentor.currentRoleId,
			input.organization ?? existingMentor.organization,
			input.yearsOfExperience ?? existingMentor.yearsOfExperience,
			input.personalWebsite ?? existingMentor.personalWebsite,
			input.resumeId ?? existingMentor.resumeId,
			input.educationalQualifications ??
				existingMentor.educationalQualifications,
			input.areasOfExpertise ?? existingMentor.areasOfExpertise,
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
			false,
			existingMentor.createdAt,
			new Date(),
			null,
		);

		await this.mentorRepository.updateById(existingMentor.id, updatedMentor);
	}
}
