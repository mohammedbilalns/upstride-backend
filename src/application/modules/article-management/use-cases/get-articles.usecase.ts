import { inject, injectable } from "inversify";
import type {
	ArticleQuery,
	IArticleRepository,
	IInterestRepository,
	IMentorListReadRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IStorageService } from "../../../services/storage.service.interface";
import {
	emptyPaginatedResult,
	mapPaginatedResult,
} from "../../../shared/utilities/pagination.util";
import type {
	GetArticlesInput,
	GetArticlesOutput,
} from "../dtos/article-input.dto";
import { ArticleMapper } from "../mappers/article.mapper";
import type { IGetArticlesUseCase } from "./get-articles.usecase.interface";

const DEFAULT_PAGE_SIZE = 6;

@injectable()
export class GetArticlesUseCase implements IGetArticlesUseCase {
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
		@inject(TYPES.Repositories.InterestRepository)
		private readonly _interestRepository: IInterestRepository,
		@inject(TYPES.Repositories.MentorListReadRepository)
		private readonly _mentorRepository: IMentorListReadRepository,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute(input: GetArticlesInput): Promise<GetArticlesOutput> {
		const tags: string[] = [];

		let authorIds: string[] | undefined;

		const categoryName = input.category || input.interest;
		if (categoryName) {
			const interests = await this._interestRepository.query({
				query: { name: categoryName },
			});
			if (interests.length > 0) {
				authorIds = await this._mentorRepository.findUserIdsByExpertise(
					interests[0].id,
				);
			} else {
				return mapPaginatedResult(
					emptyPaginatedResult(input.page, input.limit ?? DEFAULT_PAGE_SIZE),
					() => [],
				);
			}
		}

		const query: ArticleQuery = {
			...(input.isMentorView
				? { authorId: input.authorId }
				: !input.isAdminView
					? { isActive: true, isArchived: false }
					: {}),
			...(input.status === "active"
				? { isActive: true, isArchived: false }
				: input.status === "blocked"
					? { isBlockedByAdmin: true }
					: {}),
			...(input.search && { title: input.search }),
			...(authorIds && { authorId: authorIds }),
			...(!input.isMentorView &&
				input.authorId && { authorId: input.authorId }),
			...(input.viewerUserId && { excludeAuthorId: input.viewerUserId }),
			...(tags.length === 1 && { tags: tags[0] }),
			...(tags.length > 1 && { tags }),
			...(input.ids && { ids: input.ids }),
			isAdminView: input.isAdminView,
		};

		const result = await this._articleRepository.paginate({
			page: input.page,
			limit: input.limit ?? DEFAULT_PAGE_SIZE,
			query,
		});

		const items = await Promise.all(
			result.items.map(async (item) => {
				const dto = ArticleMapper.toDto(item);
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

		return mapPaginatedResult(result, () => items);
	}
}
