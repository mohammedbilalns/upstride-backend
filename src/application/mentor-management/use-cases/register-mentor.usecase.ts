import { inject, injectable } from "inversify";
import {
	MAX_MENTOR_APPLICATION_ATTEMPTS,
	Mentor,
} from "../../../domain/entities/mentor.entity";
import type { IMentorRepository } from "../../../domain/repositories/mentor.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type { IIdGenerator } from "../../services/id-generator.service.interface";
import type { RegisterMentorInput } from "../dtos/register-mentor.dto";
import { MaxApplicationAttemptsExceededError } from "../errors/max-application-attempts-exceeded.error";
import type { IRegisterMentorUseCase } from "./register-mentor.usecase.interface";

@injectable()
export class RegisterMentorUseCase implements IRegisterMentorUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
	) {}

	async execute(input: RegisterMentorInput): Promise<void> {
		const existingMentor = await this._mentorRepository.findByUserId(
			input.userId,
		);

		let applicationAttempts = 1;

		if (existingMentor) {
			if (
				existingMentor.applicationAttempts >= MAX_MENTOR_APPLICATION_ATTEMPTS
			) {
				throw new MaxApplicationAttemptsExceededError();
			}
			applicationAttempts = existingMentor.applicationAttempts + 1;
		}

		const mentor = new Mentor(
			existingMentor?.id || this._idGenerator.generate(),
			input.userId,
			input.bio,
			input.currentRoleId,
			input.organization,
			input.yearsOfExperience,
			null,
			input.personalWebsite,
			input.resumeId,
			input.educationalQualifications,
			input.areasOfExpertise,
			input.toolsAndSkills.map((ts) => ({
				skillId: ts.skillId,
				level: ts.level,
			})),
			input.experience.map((exp) => ({
				company: exp.company,
				role: exp.role,
				description: exp.description,
				from: new Date(exp.from),
				to: exp.to ? new Date(exp.to) : null,
			})),
			false,
			applicationAttempts,
			false,
			existingMentor?.createdAt || new Date(),
			new Date(),
			null,
		);

		if (existingMentor) {
			await this._mentorRepository.updateById(existingMentor.id, mentor);
		} else {
			await this._mentorRepository.create(mentor);
		}
	}
}
