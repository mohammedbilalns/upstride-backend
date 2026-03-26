import { inject, injectable } from "inversify";
import { ArticleReaction } from "../../../../domain/entities/article-reaction.entity";
import { ArticleReactionCreatedEvent } from "../../../../domain/events/article-reaction-created.event";
import type {
	IArticleReactionRepository,
	IArticleRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { EventBus } from "../../../events/event-bus.interface";
import type {
	ReactToArticleInput,
	ReactToArticleOutput,
} from "../dtos/article-input.dto";
import { ArticleNotFoundError } from "../errors";
import { ArticleReactionMapper } from "../mappers/article-reaction.mapper";
import type { IReactToArticleUseCase } from "./react-to-article.usecase.interface";

@injectable()
export class ReactToArticleUseCase implements IReactToArticleUseCase {
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
		@inject(TYPES.Repositories.ArticleReactionRepository)
		private readonly _reactionRepository: IArticleReactionRepository,
		@inject(TYPES.Services.EventBus)
		private readonly _eventBus: EventBus,
	) {}

	async execute(input: ReactToArticleInput): Promise<ReactToArticleOutput> {
		const article = await this._articleRepository.findById(input.articleId);
		if (!article || !article.isActive) {
			throw new ArticleNotFoundError();
		}

		const existing = await this._reactionRepository.query({
			query: { resourceId: input.articleId, userId: input.userId },
		});

		let likeDelta = 0;
		let dislikeDelta = 0;

		if (existing.length > 0) {
			const current = existing[0];
			if (current.reactionType === input.reactionType) {
				// Toggle off
				await this._reactionRepository.deleteById(current.id);
				if (input.reactionType === "LIKE") likeDelta = -1;
				else dislikeDelta = -1;

				await this._updateArticleCounts(article, likeDelta, dislikeDelta);
				return { reaction: null as any };
			}

			// Switch reaction
			const updated = await this._reactionRepository.updateById(current.id, {
				reactionType: input.reactionType,
			});

			if (input.reactionType === "LIKE") {
				likeDelta = 1;
				dislikeDelta = -1;
			} else {
				likeDelta = -1;
				dislikeDelta = 1;
			}

			await this._updateArticleCounts(article, likeDelta, dislikeDelta);

			if (updated) {
				await this._eventBus.publish(
					new ArticleReactionCreatedEvent(
						article.id,
						article.slug,
						article.authorId,
						input.reactionType,
						input.userId,
					),
				);
				return { reaction: ArticleReactionMapper.toDto(updated) };
			}
		}

		// New reaction
		const reaction = new ArticleReaction(
			"",
			input.articleId,
			input.userId,
			input.reactionType,
			null,
		);

		const created = await this._reactionRepository.create(reaction);
		if (input.reactionType === "LIKE") likeDelta = 1;
		else dislikeDelta = 1;

		await this._updateArticleCounts(article, likeDelta, dislikeDelta);

		await this._eventBus.publish(
			new ArticleReactionCreatedEvent(
				article.id,
				article.slug,
				article.authorId,
				input.reactionType,
				input.userId,
			),
		);
		return { reaction: ArticleReactionMapper.toDto(created) };
	}

	private async _updateArticleCounts(
		article: any,
		likeDelta: number,
		dislikeDelta: number,
	): Promise<void> {
		if (likeDelta === 0 && dislikeDelta === 0) return;

		const currentLikes = article.likesCount ?? 0;
		const currentDislikes = article.dislikesCount ?? 0;

		await this._articleRepository.updateById(article.id, {
			likesCount: Math.max(0, currentLikes + likeDelta),
			dislikesCount: Math.max(0, currentDislikes + dislikeDelta),
		} as any);
	}
}
