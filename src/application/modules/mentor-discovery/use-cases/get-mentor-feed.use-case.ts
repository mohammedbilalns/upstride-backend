import { inject, injectable } from "inversify";
import type {
	IMentorProfileReadRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import type { MentorProfileDetails } from "../../../../domain/repositories/mentor.repository.types";
import { TYPES } from "../../../../shared/types/types";
import { computeMentorFeed } from "../../../../shared/utilities/feed-scoring.util";
import { reorderByIds } from "../../../../shared/utilities/reorder-by-ids.util";
import type { IFeedCacheService } from "../../../services";
import type { IStorageService } from "../../../services/storage.service.interface";
import {
	emptyPaginatedResult,
	mapPaginatedResult,
} from "../../../shared/utilities/pagination.util";
import { UserNotFoundError } from "../../authentication/errors";
import type {
	GetMentorFeedInput,
	GetMentorsResponse,
} from "../dtos/get-mentors.dto";
import { MentorDiscoveryMapper } from "../mappers/mentor-discovery.mapper";
import type { IGetMentorFeedUseCase } from "./get-mentor-feed.use-case.interface";

const MAX_FEED_CANDIDATES = 150;

const isVisibleFeedMentor = (
	profile: MentorProfileDetails | null,
	requestingUserId: string,
): profile is MentorProfileDetails => {
	if (!profile) {
		return false;
	}

	return (
		profile.isApproved &&
		!profile.isUserBlocked &&
		profile.userId !== requestingUserId
	);
};

@injectable()
export class GetMentorFeedUseCase implements IGetMentorFeedUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorProfileReadRepository)
		private readonly _mentorProfileReadRepository: IMentorProfileReadRepository,
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.FeedCacheService)
		private readonly _feedCacheService: IFeedCacheService,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute(input: GetMentorFeedInput): Promise<GetMentorsResponse> {
		const user = await this._userRepository.findById(input.userId);

		if (!user) throw new UserNotFoundError();

		const interests = user.preferences?.interests ?? [];
		if (interests.length === 0) {
			return mapPaginatedResult(
				emptyPaginatedResult(input.page, input.limit),
				() => [],
			);
		}

		const key = `feed:mentors:${input.userId}`;
		const skip = (input.page - 1) * input.limit;

		let ids = this._feedCacheService.get(key);

		if (!ids) {
			const candidates =
				await this._mentorProfileReadRepository.findFeedCandidates(
					interests,
					MAX_FEED_CANDIDATES,
				);
			ids = computeMentorFeed(candidates, interests, MAX_FEED_CANDIDATES);
			this._feedCacheService.set(key, ids);
		}

		const pageIds = ids.slice(skip, skip + input.limit);
		if (pageIds.length === 0) {
			return {
				items: [],
				total: ids.length,
				page: input.page,
				limit: input.limit,
				totalPages: Math.ceil(ids.length / input.limit),
			};
		}

		const profiles = await Promise.all(
			pageIds.map((mentorId) =>
				this._mentorProfileReadRepository.findProfileById(mentorId),
			),
		);

		const orderedItems = await Promise.all(
			reorderByIds(
				profiles.filter((profile) =>
					isVisibleFeedMentor(profile, input.userId),
				),
				pageIds,
			).map(async (mentor) => {
				const dto = MentorDiscoveryMapper.toDto({
					...mentor,
					categories: mentor.expertisesDetails,
					skills: mentor.skillsDetails.map((skill) => ({
						id: skill.skillId.id,
						name: skill.skillId.name,
					})),
				});

				if (mentor.user.profilePictureId) {
					dto.avatar = this._storageService.getPublicUrl(
						mentor.user.profilePictureId,
					);
				} else {
					dto.avatar = undefined;
				}

				return dto;
			}),
		);

		return {
			items: orderedItems,
			total: ids.length,
			page: input.page,
			limit: input.limit,
			totalPages: Math.ceil(ids.length / input.limit),
		};
	}
}
