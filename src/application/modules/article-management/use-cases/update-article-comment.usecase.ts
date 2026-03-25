import { inject, injectable } from "inversify";
import type { IArticleCommentRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { ValidationError } from "../../../shared/errors/validation-error";
import type {
	UpdateArticleCommentInput,
	UpdateArticleCommentOutput,
} from "../dtos/article-input.dto";
import { ArticleCommentNotFoundError } from "../errors";
import { ArticleCommentMapper } from "../mappers/article-comment.mapper";
import type { IUpdateArticleCommentUseCase } from "./update-article-comment.usecase.interface";

@injectable()
export class UpdateArticleCommentUseCase
	implements IUpdateArticleCommentUseCase
{
	constructor(
		@inject(TYPES.Repositories.ArticleCommentRepository)
		private readonly _commentRepository: IArticleCommentRepository,
	) {}

	async execute(
		input: UpdateArticleCommentInput,
	): Promise<UpdateArticleCommentOutput> {
		const comment = await this._commentRepository.findById(input.commentId);
		if (!comment || !comment.isActive) {
			throw new ArticleCommentNotFoundError();
		}

		if (comment.userId !== input.userId) {
			throw new ValidationError("You can only update your own comments");
		}

		const updated = await this._commentRepository.updateById(input.commentId, {
			content: input.content,
		});

		if (!updated) {
			throw new ArticleCommentNotFoundError();
		}

		return { comment: ArticleCommentMapper.toDto(updated) };
	}
}
