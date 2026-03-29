import { inject, injectable } from "inversify";
import type {
	IArticleCommentRepository,
	IArticleRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type {
	DeleteArticleCommentInput,
	DeleteArticleCommentOutput,
} from "../dtos/article-input.dto";
import {
	ArticleCommentNotFoundError,
	ArticleCommentOwnershipError,
} from "../errors";
import type { IDeleteArticleCommentUseCase } from "./delete-article-comment.usecase.interface";

@injectable()
export class DeleteArticleCommentUseCase
	implements IDeleteArticleCommentUseCase
{
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
		@inject(TYPES.Repositories.ArticleCommentRepository)
		private readonly _commentRepository: IArticleCommentRepository,
	) {}

	async execute(
		input: DeleteArticleCommentInput,
	): Promise<DeleteArticleCommentOutput> {
		const comment = await this._commentRepository.findById(input.commentId);
		if (!comment || !comment.isActive) {
			throw new ArticleCommentNotFoundError();
		}

		if (comment.userId !== input.userId) {
			throw new ArticleCommentOwnershipError("delete");
		}

		await this._commentRepository.updateById(input.commentId, {
			isActive: false,
		});

		// Sync comments count
		const article = await this._articleRepository.findById(comment.articleId);
		if (article) {
			const currentComments = article.commentsCount ?? 0;
			await this._articleRepository.updateById(article.id, {
				commentsCount: Math.max(0, currentComments - 1),
			});
		}

		return { commentId: input.commentId };
	}
}
