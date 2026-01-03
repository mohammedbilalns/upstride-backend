import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IArticleCommentRepository } from "../../../domain/repositories";
import { IUpdateCommentUC } from "../../../domain/useCases/comments/updateComment.usecase.interface";
import { UpdateCommentDto } from "../../dtos/articleComment.dto";
import { AppError } from "../../errors/AppError";

export class UpdateCommentUC implements IUpdateCommentUC {
	constructor(private _commentRepository: IArticleCommentRepository) {}

	async execute(dto: UpdateCommentDto): Promise<void> {
		const comment = await this._commentRepository.findById(dto.commentId);
		if (!comment)
			throw new AppError(
				ErrorMessage.ARTICLE_COMMENT_NOT_FOUND,
				HttpStatus.NOT_FOUND,
			);
		if (comment.userId !== dto.userId)
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
		await this._commentRepository.update(dto.commentId, {
			content: dto.content,
		});
	}
}
