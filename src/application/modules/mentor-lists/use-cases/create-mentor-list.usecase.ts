import { inject, injectable } from "inversify";
import { MentorList } from "../../../../domain/entities/mentor-list.entity";
import type { IMentorListRepository } from "../../../../domain/repositories/mentor-list.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type {
	CreateMentorListInput,
	CreateMentorListOutput,
} from "../dtos/mentor-list.dto";
import { MaxListPerUserError } from "../errors";
import { MentorListMapper } from "../mappers/mentor-list.mapper";
import type { ICreateMentorListUseCase } from "./create-mentor-list.usecase.interface";

//FIX: Move to domain
const MAX_LISTS_PER_USER = 20;

@injectable()
export class CreateMentorListUseCase implements ICreateMentorListUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorListRepository)
		private readonly _mentorListRepository: IMentorListRepository,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
	) {}

	async execute(input: CreateMentorListInput): Promise<CreateMentorListOutput> {
		const count = await this._mentorListRepository.countByUserId(input.userId);
		if (count >= MAX_LISTS_PER_USER) {
			throw new MaxListPerUserError();
		}

		const list = new MentorList(
			this._idGenerator.generate(),
			input.userId,
			input.name,
			input.description ?? null,
		);

		const created = await this._mentorListRepository.create(list);
		return { list: MentorListMapper.toDto(created) };
	}
}
