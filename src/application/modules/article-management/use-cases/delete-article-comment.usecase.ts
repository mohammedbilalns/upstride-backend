import { inject, injectable } from "inversify";
import type { IArticleCommentRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { ValidationError } from "../../../shared/errors/validation-error";
import type { DeleteArticleCommentInput } from "../dtos/article-input.dto";
import { ArticleCommentNotFoundError } from "../errors";
import type { IDeleteArticleCommentUseCase } from "./delete-article-comment.usecase.interface";

@injectable()
export class DeleteArticleCommentUseCase
	implements IDeleteArticleCommentUseCase
{
	constructor(
		@inject(TYPES.Repositories.ArticleCommentRepository)
		private readonly _commentRepository: IArticleCommentRepository,
	) {}

	async execute(input: DeleteArticleCommentInput): Promise<void> {
		const comment = await this._commentRepository.findById(input.commentId);
		if (!comment || !comment.isActive) {
			throw new ArticleCommentNotFoundError();
		}

		if (comment.userId !== input.userId) {
			throw new ValidationError("You can only delete your own comments");
		}

		await this._commentRepository.updateById(input.commentId, {
			isActive: false,
		});
	}
}
