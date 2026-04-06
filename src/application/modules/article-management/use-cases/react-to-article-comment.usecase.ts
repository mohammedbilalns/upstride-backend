import { inject, injectable } from "inversify";
import { ArticleReaction } from "../../../../domain/entities/article-reaction.entity";
import { ArticleCommentReactionCreatedEvent } from "../../../../domain/events/article-comment-reaction-created.event";
import type {
	IArticleCommentRepository,
	IArticleReactionRepository,
	IArticleRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IEventBus } from "../../../events/app-event-bus.interface";
import type {
	ReactToArticleCommentInput,
	ReactToArticleCommentOutput,
} from "../dtos/article-input.dto";
import { ArticleCommentNotFoundError } from "../errors";
import { ArticleReactionMapper } from "../mappers/article-reaction.mapper";
import type { IReactToArticleCommentUseCase } from "./react-to-article-comment.usecase.interface";

@injectable()
export class ReactToArticleCommentUseCase
	implements IReactToArticleCommentUseCase
{
	constructor(
		@inject(TYPES.Repositories.ArticleCommentRepository)
		private readonly _commentRepository: IArticleCommentRepository,
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
		@inject(TYPES.Repositories.ArticleReactionRepository)
		private readonly _reactionRepository: IArticleReactionRepository,
		@inject(TYPES.Services.AppEventBus)
		private readonly _eventBus: IEventBus,
	) {}

	async execute(
		input: ReactToArticleCommentInput,
	): Promise<ReactToArticleCommentOutput> {
		const comment = await this._commentRepository.findById(input.commentId);
		if (!comment || !comment.isActive) {
			throw new ArticleCommentNotFoundError();
		}

		const article = await this._articleRepository.findById(comment.articleId);
		if (!article || !article.isActive) {
			throw new ArticleCommentNotFoundError();
		}

		const existing = await this._reactionRepository.query({
			query: { resourceId: input.commentId, userId: input.userId },
		});

		if (existing.length > 0) {
			// Already liked - toggle off
			const current = existing[0];
			await this._reactionRepository.deleteById(current.id);

			const currentLikes = comment.likesCount ?? 0;
			await this._commentRepository.updateById(comment.id, {
				likesCount: Math.max(0, currentLikes - 1),
			});

			return { reaction: null };
		}

		// New like
		const reaction = new ArticleReaction(
			"",
			input.commentId,
			input.userId,
			"LIKE",
			null,
		);

		const created = await this._reactionRepository.create(reaction);
		const currentLikes = comment.likesCount ?? 0;
		await this._commentRepository.updateById(comment.id, {
			likesCount: currentLikes + 1,
		});

		await this._eventBus.publish(
			new ArticleCommentReactionCreatedEvent({
				articleId: article.id,
				articleSlug: article.slug,
				articleAuthorId: article.authorId,
				commentId: comment.id,
				reactionType: "LIKE",
				actorId: input.userId,
				actorName: created.actorName || "",
				count: currentLikes + 1,
			}),
			{ durable: true },
		);
		return { reaction: ArticleReactionMapper.toDto(created) };
	}
}
