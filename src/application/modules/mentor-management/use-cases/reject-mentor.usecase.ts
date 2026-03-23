import { inject, injectable } from "inversify";
import type { IMentorRepository } from "../../../../domain/repositories/mentor.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { RejectMentorInput } from "../dtos/reject-mentor.dto";
import { MentorApplicationNotFoundError } from "../errors/mentor-application-not-found.error";
import type { IRejectMentorUseCase } from "./reject-mentor.usecase.interface";

@injectable()
export class RejectMentorUseCase implements IRejectMentorUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
	) {}

	async execute(input: RejectMentorInput): Promise<void> {
		const mentor = await this._mentorRepository.findById(input.mentorId);
		if (!mentor) {
			throw new MentorApplicationNotFoundError();
		}

		await this._mentorRepository.updateById(input.mentorId, {
			isApproved: false,
			isRejected: true,
			rejectionReason: input.reason,
		});
	}
}
