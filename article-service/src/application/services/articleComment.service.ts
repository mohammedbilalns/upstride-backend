import { ErrorMessage, HttpStatus } from "../../common/enums";
import { QueueEvents } from "../../common/enums/queueEvents";
import { IEventBus } from "../../domain/events/eventBus.interface";
import type {
	IArticleCommentRepository,
	IArticleRepository,
	IReactionRepository,
} from "../../domain/repositories";
import type { IArticleCommentService } from "../../domain/services/articleComment.service.interface";
import type {
	ArticleCommentDto,
	ArticleCommentUpdateDto,
	fetchCommentsDto,
	fetchCommentsResponseDto,
} from "../dtos/articleComment.dto";

import { AppError } from "../errors/AppError";

export class ArticleCommentService implements IArticleCommentService {
	constructor(
		private _articleCommentRepository: IArticleCommentRepository,
		private _articleRepository: IArticleRepository,
		private _reactionRepository: IReactionRepository,
		private _eventBus: IEventBus,
	) {}

	async createComment(articleCommentDto: ArticleCommentDto): Promise<void> {
		const { articleId, userId, userName, userImage, content, parentCommentId } =
			articleCommentDto;
		const article = await this._articleRepository.findById(articleId);
		if (!article)
			throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);

		await Promise.all([
			this._articleCommentRepository.create({
				articleId,
				userId,
				userName,
				userImage,
				content,
				parentId: parentCommentId,
			}),
			this._articleRepository.update(article.id, {
				comments: article.comments + 1,
			}),
		]);
		if (parentCommentId) {
			await Promise.all([
				this._articleCommentRepository.incrementReplies(parentCommentId),
				this._articleCommentRepository.incrementRepliesWithParent(
					parentCommentId,
				),
			]);
		}
		this._eventBus.publish(QueueEvents.SEND_NOTIFICATION, {
			userId:article.author,
			type: parentCommentId ? "REPLY_COMMENT" : "COMMENT_ARTICLE",
			triggeredBy: userName,
			targetResource: articleId,
		})
	}

	async updateComment(
		articleCommentUpdateDto: ArticleCommentUpdateDto,
	): Promise<void> {
		const { commentId, content, userId } = articleCommentUpdateDto;
		const comment = await this._articleCommentRepository.findById(commentId);
		if (!comment)
			throw new AppError(
				ErrorMessage.ARTICLE_COMMENT_NOT_FOUND,
				HttpStatus.NOT_FOUND,
			);
		if (comment.userId !== userId)
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
		await this._articleCommentRepository.update(commentId, { content });
	}

	async getComments(
		fetchCommentsDto: fetchCommentsDto,
	): Promise<fetchCommentsResponseDto> {
		const {
			articleId,
			page,
			limit,
			parentCommentId: parentId,
			userId,
		} = fetchCommentsDto;

		const article = await this._articleRepository.findById(articleId);
		if (!article)
			throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);

		const { comments, total } =
			await this._articleCommentRepository.findByArticle(
				articleId,
				page,
				limit,
				parentId,
			);

		const commentsWithIsLiked = await Promise.all(
			comments.map(async (comment) => {
				const userReaction =
					await this._reactionRepository.findByResourceAndUser(
						comment.id,
						userId,
					);
				const isLiked = userReaction?.reaction === "like";

				if (!comment.isActive) {
					return {
						id: comment.id,
						isDeleted: true,
						isActive: false,
						createdAt: comment.createdAt,
						userName: comment.userName,
						replies: comment.replies,
						likes: comment.likes,
						isLiked,
						parentCommentId: comment.parentId ?? null,
					};
				}

				return {
					...comment,
					isLiked,
					isDeleted: false,
				};
			}),
		);

		return {
			comments: commentsWithIsLiked,
			total,
		};
	}

	async deleteComment(id: string, userId: string): Promise<void> {
		const comment = await this._articleCommentRepository.findById(id);
		if (!comment)
			throw new AppError(
				ErrorMessage.ARTICLE_COMMENT_NOT_FOUND,
				HttpStatus.NOT_FOUND,
			);
		if (comment.userId !== userId)
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);

		const article = await this._articleRepository.findById(comment.articleId);
		if (!article)
			throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);
		await Promise.all([
			this._articleCommentRepository.update(id, { isActive: false }),
			this._articleRepository.update(comment.articleId, {
				comments: article.comments - 1,
			}),
		]);
	}
}
