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

	async execute(dto: CreateCommentDto): Promise<void> {
		const article = await this._articleRepository.findById(dto.articleId);
		if (!article)
			throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);

		await Promise.all([
			this._commentRepository.create({
				articleId: dto.articleId,
				userId: dto.userId,
				userName: dto.userName,
				userImage: dto.userImage,
				content: dto.content,
				parentId: dto.parentCommentId,
			}),
			this._articleRepository.update(article.id, {
				comments: article.comments + 1,
			}),
		]);
		if (dto.parentCommentId) {
			await Promise.all([
				this._commentRepository.incrementReplies(dto.parentCommentId),
				this._commentRepository.incrementRepliesWithParent(dto.parentCommentId),
			]);
		}
		if (article.author !== dto.userId) {
			this._eventBus.publish(QueueEvents.SEND_NOTIFICATION, {
				userId: article.author,
				type: dto.parentCommentId ? "REPLY_COMMENT" : "COMMENT_ARTICLE",
				triggeredBy: dto.userName,
				targetResource: dto.articleId,
			});
		}
	}
}
