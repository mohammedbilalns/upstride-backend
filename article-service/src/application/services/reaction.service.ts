import { ErrorMessage, HttpStatus } from "../../common/enums";
import { QueueEvents } from "../../common/enums/queueEvents";
import type { Reaction } from "../../domain/entities/reaction.entity";
import type { IEventBus } from "../../domain/events/eventBus.interface";
import type {
	IArticleCommentRepository,
	IArticleRepository,
	IReactionRepository,
} from "../../domain/repositories";
import type { IReactionService } from "../../domain/services";
import type {
	Article,
	ArticleComment,
	ReactionDto,
} from "../dtos/reaction.dto";
import { AppError } from "../errors/AppError";

export class ReactionService implements IReactionService {
	constructor(
		private _reactionRepository: IReactionRepository,
		private _articleRepository: IArticleRepository,
		private _articleCommentRepository: IArticleCommentRepository,
		private _eventBus: IEventBus,
	) {}

	private async sendReactionEvent(
		resource: Article | ArticleComment,
		resourceType: "article" | "comment",
		triggeredBy: string,
	) {
		let notificationUserId: string;
		let targetId: string;

		if (resourceType === "article") {
			const article = resource as Article;
			notificationUserId = article.author;
			targetId = article.id;
		} else {
			const comment = resource as ArticleComment;

			if (!comment.articleId || typeof comment.articleId === "string") {
				throw new AppError(
					ErrorMessage.ARTICLE_NOT_FOUND,
					HttpStatus.NOT_FOUND,
				);
			}

			notificationUserId = comment.articleId.author;
			targetId = comment.articleId.id;
		}

		await this._eventBus.publish(QueueEvents.SEND_NOTIFICATION, {
			userId: notificationUserId,
			type: resourceType === "article" ? "REACT_ARTICLE" : "REACT_COMMENT",
			triggeredBy,
			targetResource: targetId,
		});
	}

	private getResourceHandlers(resourceType: "article" | "comment") {
		switch (resourceType) {
			case "article":
				return {
					repository: this._articleRepository,
					notFoundError: ErrorMessage.ARTICLE_NOT_FOUND,
					alreadedReactedError: ErrorMessage.ARTICLE_ALREADY_REACTED,
				};
			case "comment":
				return {
					repository: this._articleCommentRepository,
					notFoundError: ErrorMessage.ARTICLE_COMMENT_NOT_FOUND,
					alreadedReactedError: ErrorMessage.ARTICLE_COMMENT_ALREADY_REACTED,
				};
			default:
				throw new Error(ErrorMessage.INVALID_RESOURCE_TYPE);
		}
	}

	async reactToResource(dto: ReactionDto): Promise<void> {
		const { resourceId, resourceType, userId, userName, reaction } = dto;
		const { repository, notFoundError, alreadedReactedError } =
			this.getResourceHandlers(resourceType);

		const resource = await repository.findById(
			resourceId,
			resourceType === "comment" ? "articleId" : undefined,
		);
		if (!resource) throw new AppError(notFoundError, HttpStatus.NOT_FOUND);

		const existingReaction =
			await this._reactionRepository.findByResourceAndUser(resourceId, userId);

		if (existingReaction) {
			if (existingReaction.reaction === reaction)
				throw new AppError(alreadedReactedError, HttpStatus.BAD_REQUEST);
			await this._reactionRepository.update(existingReaction.id, { reaction });
		} else {
			await this._reactionRepository.create({ resourceId, userId, reaction });
		}

		// update likes count in the resource
		const likesChanged = reaction === "like" ? 1 : -1;
		await repository.update(resourceId, {
			likes: (resource.likes ?? 0) + likesChanged,
		});

		if (reaction === "like") {
			let authorId: string;

			if (resourceType === "article") {
				authorId = (resource as Article).author;
			} else {
				const comment = resource as ArticleComment;
				if (!comment.articleId || typeof comment.articleId === "string") {
					throw new AppError(
						ErrorMessage.ARTICLE_NOT_FOUND,
						HttpStatus.NOT_FOUND,
					);
				}
				authorId = comment.articleId.author;
			}

			if (authorId !== userId) {
				await this.sendReactionEvent(resource, resourceType, userName);
			}
		}
	}
	async getReactions(
		resourceId: string,
		page: number,
		limit: number,
	): Promise<Partial<Reaction>[]> {
		return await this._reactionRepository.findByResource(
			resourceId,
			page,
			limit,
		);
	}
}
