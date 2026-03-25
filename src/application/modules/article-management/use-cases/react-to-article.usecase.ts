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

		if (existing.length > 0) {
			const current = existing[0];
			if (current.reactionType === input.reactionType) {
				return { reaction: ArticleReactionMapper.toDto(current) };
			}

			const updated = await this._reactionRepository.updateById(current.id, {
				reactionType: input.reactionType,
			});

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

		const reaction = new ArticleReaction(
			"",
			input.articleId,
			input.userId,
			input.reactionType,
			null,
		);

		const created = await this._reactionRepository.create(reaction);
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
}
