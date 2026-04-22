import { inject, injectable } from "inversify";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { RejectMentorInput } from "../dtos/reject-mentor.dto";
import { MentorApplicationNotFoundError } from "../errors/mentor-application-not-found.error";
import type { IRejectMentorUseCase } from "./reject-mentor.use-case.interface";

@injectable()
export class RejectMentorUseCase implements IRejectMentorUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorRepository: IMentorWriteRepository,
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
