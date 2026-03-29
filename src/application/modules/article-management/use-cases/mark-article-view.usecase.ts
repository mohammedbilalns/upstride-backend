import { inject, injectable } from "inversify";
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
		if (!article) {
			throw new ArticleNotFoundError();
		}

		if (!article.isActive) {
			return;
		}

		if (article.authorId === input.viewerUserId) {
			return;
		}

		const wasNew = await this._articleViewRepository.upsert(
			input.articleId,
			input.viewerUserId,
		);

		if (wasNew) {
			await this._articleRepository.updateById(input.articleId, {
				views: (article.views ?? 0) + 1,
			});
		}
	}
}
