import { ErrorMessage, HttpStatus } from "../../../common/enums";
import {
	IArticleCommentRepository,
	IArticleRepository,
} from "../../../domain/repositories";
import { IDeleteCommentUC } from "../../../domain/useCases/comments/deleteComment.usecase.interface";
import { DeleteCommentDto } from "../../dtos/articleComment.dto";
import { AppError } from "../../errors/AppError";

export class DeleteCommentUC implements IDeleteCommentUC {
	constructor(
		private _commentRepository: IArticleCommentRepository,
		private _articleRepository: IArticleRepository,
	) {}

	async execute(dto: DeleteCommentDto): Promise<void> {
		const comment = await this._commentRepository.findById(dto.commentId);
		if (!comment)
			throw new AppError(
				ErrorMessage.ARTICLE_COMMENT_NOT_FOUND,
				HttpStatus.NOT_FOUND,
			);
		if (comment.userId !== dto.userId)
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);

		const article = await this._articleRepository.findById(comment.articleId);
		if (!article)
			throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);
		await Promise.all([
			this._commentRepository.update(dto.commentId, { isActive: false }),
			this._articleRepository.update(comment.articleId, {
				comments: article.comments - 1,
			}),
		]);
	}
}
