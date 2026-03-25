import { inject, injectable } from "inversify";
import { ArticleView } from "../../../../domain/entities/article-view.entity";
import type {
	IArticleRepository,
	IArticleViewRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { MarkArticleViewInput } from "../dtos/article-input.dto";
import { ArticleNotFoundError } from "../errors";
import type { IMarkArticleViewUseCase } from "./mark-article-view.usecase.interface";

@injectable()
export class MarkArticleViewUseCase implements IMarkArticleViewUseCase {
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
		@inject(TYPES.Repositories.ArticleViewRepository)
		private readonly _articleViewRepository: IArticleViewRepository,
	) {}

	async execute(input: MarkArticleViewInput): Promise<void> {
		const article = await this._articleRepository.findById(input.articleId);
		if (!article || !article.isActive) {
			throw new ArticleNotFoundError();
		}

		if (article.authorId === input.viewerUserId) {
			return;
		}

		const existingViews = await this._articleViewRepository.query({
			query: {
				articleId: input.articleId,
				userId: input.viewerUserId,
			},
		});

		if (existingViews.length > 0) {
			return;
		}

		const view = new ArticleView("", input.articleId, input.viewerUserId);

		await this._articleViewRepository.create(view);

		await this._articleRepository.updateById(input.articleId, {
			views: article.views + 1,
		});
	}
}
