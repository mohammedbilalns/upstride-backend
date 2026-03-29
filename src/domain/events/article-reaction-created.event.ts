import type { ArticleReactionType } from "../entities/article-reaction.entity";
import type { AppEvent } from "./domain-event";

export class ArticleReactionCreatedEvent implements AppEvent {
	readonly eventName = "article.reaction.created";
	readonly occurredAt = new Date();

	constructor(
		public readonly articleId: string,
		public readonly articleSlug: string,
		public readonly articleAuthorId: string,
		public readonly reactionType: ArticleReactionType,
		public readonly actorId: string,
		public readonly actorName: string,
		public readonly count: number,
	) {}
}
