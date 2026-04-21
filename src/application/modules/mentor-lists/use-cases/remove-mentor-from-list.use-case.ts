import { inject, injectable } from "inversify";
import type { IMentorListRepository } from "../../../../domain/repositories/mentor-list.repository.interface";
import type { ISavedMentorRepository } from "../../../../domain/repositories/saved-mentor.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { MentorNotFoundError } from "../../../shared/errors/mentor-not-found.error";
import type { RemoveMentorFromListInput } from "../dtos/mentor-list.dto";
import { MentorListNotFoundError } from "../errors";
import type { IRemoveMentorFromListUseCase } from "./remove-mentor-from-list.use-case.interface";

@injectable()
export class RemoveMentorFromListUseCase
	implements IRemoveMentorFromListUseCase
{
	constructor(
		@inject(TYPES.Repositories.MentorListRepository)
		private readonly _mentorListRepository: IMentorListRepository,
		@inject(TYPES.Repositories.SavedMentorRepository)
		private readonly _savedMentorRepository: ISavedMentorRepository,
	) {}

	async execute(input: RemoveMentorFromListInput): Promise<void> {
		const list = await this._mentorListRepository.findByIdAndUserId(
			input.listId,
			input.userId,
		);
		if (!list) {
			throw new MentorListNotFoundError();
		}

		const existing = await this._savedMentorRepository.findByUserMentorList(
			input.userId,
			input.mentorId,
			input.listId,
		);

		if (!existing) {
			throw new MentorNotFoundError();
		}

		await this._savedMentorRepository.deleteByUserMentorList(
			input.userId,
			input.mentorId,
			input.listId,
		);
	}
}
