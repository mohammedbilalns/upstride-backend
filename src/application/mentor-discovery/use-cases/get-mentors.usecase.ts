import { inject, injectable } from "inversify";
import type {
	IMentorRepository,
	MentorDiscoveryQuery,
} from "../../../domain/repositories/mentor.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type {
	GetMentorsInput,
	GetMentorsResponse,
} from "../dtos/get-mentors.dto";
import { MentorDiscoveryMapper } from "../mappers/mentor-discovery.mapper";
import type { IGetMentorsUseCase } from "./get-mentors.usecase.interface";

@injectable()
export class GetMentorsUseCase implements IGetMentorsUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
	) {}

	async execute(input: GetMentorsInput): Promise<GetMentorsResponse> {
		const query: MentorDiscoveryQuery = {
			search: input.search,
			categoryId: input.categoryId,
			tierId: input.tierId,
			minExperience: input.minExperience,
			maxExperience: input.maxExperience,
		};

		const sort: Record<string, 1 | -1> =
			input.sort === "recent" ? { createdAt: -1 } : { avgRating: -1 };

		const result = await this._mentorRepository.paginateDiscoverable({
			page: input.page,
			limit: input.limit,
			query,
			sort,
		});

		return {
			items: MentorDiscoveryMapper.toDtos(result.items),
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}
