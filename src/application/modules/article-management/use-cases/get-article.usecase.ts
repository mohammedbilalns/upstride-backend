import { inject, injectable } from "inversify";
import type { IArticleRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type {
	GetArticleInput,
	GetArticleOutput,
} from "../dtos/article-input.dto";
import { ArticleNotFoundError } from "../errors";
import { ArticleMapper } from "../mappers/article.mapper";
import type { IGetArticleUseCase } from "./get-article.usecase.interface";
import type { IMarkArticleViewUseCase } from "./mark-article-view.usecase.interface";

@injectable()
export class GetArticleUseCase implements IGetArticleUseCase {
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
		@inject(TYPES.UseCases.MarkArticleView)
		private readonly _markArticleViewUseCase: IMarkArticleViewUseCase,
	) {}

	async execute(input: GetArticleInput): Promise<GetArticleOutput> {
		const article = await this._articleRepository.findBySlug(input.slug);
		if (!article || !article.isActive) {
			throw new ArticleNotFoundError();
		}

		if (input.viewerUserId) {
			await this._markArticleViewUseCase.execute({
				articleId: article.id,
				viewerUserId: input.viewerUserId,
			});
		}

		return {
			article: ArticleMapper.toDto(article),
			isAuthor: input.viewerUserId === article.authorId,
		};
	}
}
