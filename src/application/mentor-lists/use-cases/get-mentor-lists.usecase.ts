import { inject, injectable } from "inversify";
import type { IMentorListRepository } from "../../../domain/repositories/mentor-list.repository.interface";
import type { ISavedMentorRepository } from "../../../domain/repositories/saved-mentor.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type {
	GetMentorListsInput,
	GetMentorListsOutput,
} from "../dtos/mentor-list.dto";
import { MentorListMapper } from "../mappers/mentor-list.mapper";
import type { IGetMentorListsUseCase } from "./get-mentor-lists.usecase.interface";

@injectable()
export class GetMentorListsUseCase implements IGetMentorListsUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorListRepository)
		private readonly _mentorListRepository: IMentorListRepository,
		@inject(TYPES.Repositories.SavedMentorRepository)
		private readonly _savedMentorRepository: ISavedMentorRepository,
	) {}

	async execute(input: GetMentorListsInput): Promise<GetMentorListsOutput> {
		const items = await this._mentorListRepository.findAllByUserId(
			input.userId,
		);
		const itemsWithCounts = await Promise.all(
			items.map(async (item) => {
				const mentorCount = await this._savedMentorRepository.countByListId(
					item.id,
				);
				return MentorListMapper.toDtoWithCount(item, mentorCount);
			}),
		);
		return { items: itemsWithCounts };
	}
}
