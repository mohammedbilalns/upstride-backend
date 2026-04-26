import { inject, injectable } from "inversify";
import type {
	IArticleRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { computeArticleFeed } from "../../../../shared/utilities/feed-scoring.util";
import { reorderByIds } from "../../../../shared/utilities/reorder-by-ids.util";
import type { IFeedCacheService } from "../../../services";
import type { IStorageService } from "../../../services/storage.service.interface";
import {
	emptyPaginatedResult,
	mapPaginatedResult,
} from "../../../shared/utilities/pagination.util";
import { UserNotFoundError } from "../../authentication/errors";
import type { GetArticleFeedInput, GetArticlesOutput } from "../dtos";
import { ArticleMapper } from "../mappers/article.mapper";
import type { IGetArticleFeedUseCase } from "./get-article-feed.use-case.interface";

const MAX_FEED_CANDIDATES = 150;

@injectable()
export class GetArticleFeedUseCase implements IGetArticleFeedUseCase {
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.FeedCacheService)
		private readonly _feedCacheService: IFeedCacheService,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute(input: GetArticleFeedInput): Promise<GetArticlesOutput> {
		const user = await this._userRepository.findById(input.userId);

		if (!user) throw new UserNotFoundError();

		const interests = user.preferences?.interests ?? [];

		if (interests.length === 0) {
			return mapPaginatedResult(
				emptyPaginatedResult(input.page, input.limit),
				() => [],
			);
		}

		const key = `feed:articles:${input.userId}`;
		const skip = (input.page - 1) * input.limit;

		let ids = this._feedCacheService.get(key);

		if (!ids) {
			const candidates = await this._articleRepository.findFeedCandidates(
				{
					isActive: true,
					isArchived: false,
					excludeAuthorId: input.userId,
				},
				MAX_FEED_CANDIDATES,
			);

			ids = computeArticleFeed(candidates, interests, MAX_FEED_CANDIDATES);

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

		const docs = await this._articleRepository.query({
			query: {
				ids: pageIds,
				isActive: true,
				isArchived: false,
				excludeAuthorId: input.userId,
			},
		});

		const orderedItems = await Promise.all(
			reorderByIds(docs, pageIds).map(async (article) => {
				const dto = ArticleMapper.toDto(article);
				if (dto.featuredImageUrl && !dto.featuredImageUrl.startsWith("http")) {
					try {
						dto.featuredImageUrl = this._storageService.getPublicUrl(
							dto.featuredImageId,
						);
					} catch (err) {
						console.error("Failed to sign article featured image URL:", err);
					}
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
