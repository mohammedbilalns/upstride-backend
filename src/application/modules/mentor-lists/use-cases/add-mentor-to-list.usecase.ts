import { inject, injectable } from "inversify";
import { MentorList } from "../../../../domain/entities/mentor-list.entity";
import { SavedMentor } from "../../../../domain/entities/saved-mentor.entity";
import type { IMentorListRepository } from "../../../../domain/repositories/mentor-list.repository.interface";
import type { ISavedMentorRepository } from "../../../../domain/repositories/saved-mentor.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type { AddMentorToListInput } from "../dtos/mentor-list.dto";
import { MentorAlreadySavedError, MentorListNotFoundError } from "../errors";
import type { IAddMentorToListUseCase } from "./add-mentor-to-list.usecase.interface";

@injectable()
export class AddMentorToListUseCase implements IAddMentorToListUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorListRepository)
		private readonly _mentorListRepository: IMentorListRepository,
		@inject(TYPES.Repositories.SavedMentorRepository)
		private readonly _savedMentorRepository: ISavedMentorRepository,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
	) {}

	async execute(input: AddMentorToListInput): Promise<void> {
		const [list, existing, count] = await Promise.all([
			this._mentorListRepository.findByIdAndUserId(input.listId, input.userId),
			this._savedMentorRepository.findByUserMentorList(
				input.userId,
				input.mentorId,
				input.listId,
			),
			this._savedMentorRepository.countByListId(input.listId),
		]);

		if (!list) {
			throw new MentorListNotFoundError();
		}

		if (existing) {
			throw new MentorAlreadySavedError();
		}

		MentorList.assertCanAddMentor(count);

		const saved = new SavedMentor(
			this._idGenerator.generate(),
			input.userId,
			input.mentorId,
			input.listId,
		);

		await this._savedMentorRepository.create(saved);
	}
}
