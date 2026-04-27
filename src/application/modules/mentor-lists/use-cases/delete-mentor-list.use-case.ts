import { inject, injectable } from "inversify";
import type { IMentorListRepository } from "../../../../domain/repositories/mentor-list.repository.interface";
import type { ISavedMentorRepository } from "../../../../domain/repositories/saved-mentor.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { DeleteMentorListInput } from "../dtos/mentor-list.dto";
import { MentorListNotFoundError } from "../errors/mentor-list-not-found.error";
import type { IDeleteMentorListUseCase } from "./delete-mentor-list.use-case.interface";

@injectable()
export class DeleteMentorListUseCase implements IDeleteMentorListUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorListRepository)
		private readonly _mentorListRepository: IMentorListRepository,
		@inject(TYPES.Repositories.SavedMentorRepository)
		private readonly _savedMentorRepository: ISavedMentorRepository,
	) {}

	async execute(input: DeleteMentorListInput): Promise<void> {
		const list = await this._mentorListRepository.findByIdAndUserId(
			input.listId,
			input.userId,
		);

		if (!list) {
			throw new MentorListNotFoundError();
		}

		await Promise.all([
			this._savedMentorRepository.deleteByListId(input.listId),
			this._mentorListRepository.deleteByIdAndUserId(
				input.listId,
				input.userId,
			),
		]);
	}
}
