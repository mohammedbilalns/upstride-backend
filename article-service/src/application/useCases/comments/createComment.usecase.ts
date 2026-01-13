import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { QueueEvents } from "../../../common/enums/queueEvents";
import { IEventBus } from "../../../domain/events/eventBus.interface";
import {
	IArticleCommentRepository,
	IArticleRepository,
} from "../../../domain/repositories";
import { ICreateCommentUc } from "../../../domain/useCases/comments/createComment.usecase.interface";
import { CreateCommentDto } from "../../dtos/articleComment.dto";
import { AppError } from "../../errors/AppError";

export class CreateCommentUC implements ICreateCommentUc {
	constructor(
		private _articleRepository: IArticleRepository,
		private _commentRepository: IArticleCommentRepository,
		private _eventBus: IEventBus,
	) {}

	async execute(commentDetails: CreateCommentDto): Promise<void> {
		const article = await this._articleRepository.findById(
			commentDetails.articleId,
		);
		if (!article)
			throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);

		await Promise.all([
			this._commentRepository.create({
				articleId: commentDetails.articleId,
				userId: commentDetails.userId,
				userName: commentDetails.userName,
				userImage: commentDetails.userImage,
				content: commentDetails.content,
				parentId: commentDetails.parentCommentId,
			}),
			this._articleRepository.update(article.id, {
				comments: article.comments + 1,
			}),
		]);
		if (commentDetails.parentCommentId) {
			await Promise.all([
				this._commentRepository.incrementReplies(
					commentDetails.parentCommentId,
				),
				this._commentRepository.incrementRepliesWithParent(
					commentDetails.parentCommentId,
				),
			]);
		}
		if (article.author !== commentDetails.userId) {
			this._eventBus.publish(QueueEvents.SEND_NOTIFICATION, {
				userId: article.author,
				type: commentDetails.parentCommentId
					? "REPLY_COMMENT"
					: "COMMENT_ARTICLE",
				triggeredBy: commentDetails.userName,
				targetResource: commentDetails.articleId,
			});
		}
	}
}
