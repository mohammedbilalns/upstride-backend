import { inject, injectable } from "inversify";
import type { User } from "../../../../domain/entities/user.entity";
import type {
	ArticleQuery,
	IArticleRepository,
	IInterestRepository,
	IUserRepository,
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
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Repositories.InterestRepository)
		private readonly _interestRepository: IInterestRepository,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute(input: GetArticlesInput): Promise<GetArticlesOutput> {
		const tags: string[] = [];
		if (input.skill) tags.push(input.skill);
		if (input.interest) tags.push(input.interest);

		let authorIds: string[] | undefined;

		if (input.category) {
			const interests = await this._interestRepository.query({
				query: { name: input.category },
			});
			if (interests.length > 0) {
				const mentors = await this._userRepository.query({
					query: { interestIds: [interests[0].id] },
				});
				authorIds = mentors.map((m: User) => m.id);
			} else {
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
