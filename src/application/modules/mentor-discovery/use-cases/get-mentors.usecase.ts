import { inject, injectable } from "inversify";
import type {
	IInterestRepository,
	IMentorListReadRepository,
	MentorDiscoveryQuery,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IStorageService } from "../../../services/storage.service.interface";
import {
	emptyPaginatedResult,
	mapPaginatedResult,
} from "../../../shared/utilities/pagination.util";
import type {
	GetMentorsInput,
	GetMentorsResponse,
} from "../dtos/get-mentors.dto";
import { MentorDiscoveryMapper } from "../mappers/mentor-discovery.mapper";
import type { IGetMentorsUseCase } from "./get-mentors.usecase.interface";

@injectable()
export class GetMentorsUseCase implements IGetMentorsUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorListReadRepository)
		private readonly _mentorRepository: IMentorListReadRepository,
		@inject(TYPES.Repositories.InterestRepository)
		private readonly _interestRepository: IInterestRepository,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute(input: GetMentorsInput): Promise<GetMentorsResponse> {
		let categoryId: string | undefined;
		if (input.category) {
			const interests = await this._interestRepository.query({
				query: { name: input.category },
			});
			if (interests.length === 0) {
				return mapPaginatedResult(
					emptyPaginatedResult(input.page, input.limit),
					() => [],
				);
			}
			categoryId = interests[0].id;
		}

		const query: MentorDiscoveryQuery = {
			search: input.search,
			categoryId,
			tierName: input.tierName,
			excludeUserId: input.excludeUserId,
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

		const items = await Promise.all(
			result.items.map(async (item) => {
				const dto = MentorDiscoveryMapper.toDto(item);
				if (item.user.profilePictureId) {
					dto.avatar = this._storageService.getPublicUrl(
						item.user.profilePictureId,
					);
				} else {
					dto.avatar = undefined;
				}
				return dto;
			}),
		);

		return mapPaginatedResult(result, () => items);
	}
}
