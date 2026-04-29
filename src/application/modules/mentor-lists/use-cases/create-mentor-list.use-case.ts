import { inject, injectable } from "inversify";
import { MentorList } from "../../../../domain/entities/mentor-list.entity";
import type { IMentorListRepository } from "../../../../domain/repositories/mentor-list.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { toTitleCase } from "../../../../shared/utilities/to-title-case.util";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type {
	CreateMentorListInput,
	CreateMentorListOutput,
} from "../dtos/mentor-list.dto";
import { MentorListMapper } from "../mappers/mentor-list.mapper";
import type { ICreateMentorListUseCase } from "./create-mentor-list.use-case.interface";

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

		MentorList.assertCanCreate(count);

		const list = new MentorList(
			this._idGenerator.generate(),
			input.userId,
			toTitleCase(input.name),
			input.description ?? null,
		);

		const created = await this._mentorListRepository.create(list);
		return { list: MentorListMapper.toDto(created) };
	}
}
