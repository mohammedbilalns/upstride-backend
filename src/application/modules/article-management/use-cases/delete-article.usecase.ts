import { inject, injectable } from "inversify";
import type { IArticleRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { DeleteArticleInput } from "../dtos/article-input.dto";
import {
	ArticleBlockedByAdminError,
	ArticleNotFoundError,
	ArticleOwnershipError,
} from "../errors";
import type { IDeleteArticleUseCase } from "./delete-article.usecase.interface";

@injectable()
export class DeleteArticleUseCase implements IDeleteArticleUseCase {
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
	) {}

	async execute(input: DeleteArticleInput): Promise<void> {
		const article = await this._articleRepository.findById(input.articleId);
		if (!article) {
			throw new ArticleNotFoundError();
		}

		if (article.isBlockedByAdmin) {
			throw new ArticleBlockedByAdminError();
		}

		if (!article.isActive) {
			throw new ArticleNotFoundError();
		}

		if (article.authorId !== input.userId) {
			throw new ArticleOwnershipError("delete");
		}

		await this._articleRepository.updateById(input.articleId, {
			isActive: false,
		});
	}
}
