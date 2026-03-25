import { inject, injectable } from "inversify";
import type {
	ArticleQuery,
	IArticleRepository,
	IInterestRepository,
	IMentorListReadRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IStorageService } from "../../../services/storage.service.interface";
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
		console.log("[GetArticlesUseCase] categoryName:", categoryName);
		if (categoryName) {
			const interests = await this._interestRepository.query({
				query: { name: categoryName },
			});
			console.log(
				"[GetArticlesUseCase] found interests count:",
				interests.length,
			);
			if (interests.length > 0) {
				authorIds = await this._mentorRepository.findUserIdsByExpertise(
					interests[0].id,
				);
				console.log(
					"[GetArticlesUseCase] found authorIds count:",
					authorIds.length,
				);
			} else {
				console.log("[GetArticlesUseCase] Category not found, returning empty");
				return {
					items: [],
					total: 0,
					page: input.page,
					limit: DEFAULT_PAGE_SIZE,
					totalPages: 0,
				};
			}
		}

		const query: ArticleQuery = {
			isActive: true,
			isArchived: false,
			...(input.search && { title: input.search }),
			...(authorIds && { authorId: authorIds }),
			...(input.viewerUserId && { excludeAuthorId: input.viewerUserId }),
			...(tags.length === 1 && { tags: tags[0] }),
			...(tags.length > 1 && { tags }),
		};

		const result = await this._articleRepository.paginate({
			page: input.page,
			limit: DEFAULT_PAGE_SIZE,
			query,
		});

		const items = await Promise.all(
			result.items.map(async (item) => {
				const dto = ArticleMapper.toDto(item);
				if (dto.featuredImageUrl && !dto.featuredImageUrl.startsWith("http")) {
					try {
						dto.featuredImageUrl = await this._storageService.getSignedUrl(
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
			items,
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}
