import { inject, injectable } from "inversify";
import type { IMentorListRepository } from "../../../domain/repositories/mentor-list.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type {
	GetMentorListInput,
	GetMentorListOutput,
} from "../dtos/mentor-list.dto";
import { MentorListNotFoundError } from "../errors/mentor-list-not-found.error";
import { MentorListMapper } from "../mappers/mentor-list.mapper";
import type { IGetMentorListUseCase } from "./get-mentor-list.usecase.interface";

@injectable()
export class GetMentorListUseCase implements IGetMentorListUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorListRepository)
		private readonly _mentorListRepository: IMentorListRepository,
	) {}

	async execute(input: GetMentorListInput): Promise<GetMentorListOutput> {
		const list = await this._mentorListRepository.findByIdAndUserId(
			input.listId,
			input.userId,
		);

		if (!list) {
			throw new MentorListNotFoundError();
		}

		return { list: MentorListMapper.toDto(list) };
	}
}
