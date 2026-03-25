import type { ArticleReactionType } from "../entities/article-reaction.entity";
import type { AppEvent } from "./domain-event";

export class ArticleCommentReactionCreatedEvent implements AppEvent {
	readonly eventName = "article.comment.reaction.created";
	readonly occurredAt = new Date();

	constructor(
		public readonly articleId: string,
		public readonly articleSlug: string,
		public readonly articleAuthorId: string,
		public readonly commentId: string,
		public readonly reactionType: ArticleReactionType,
		public readonly actorId: string,
	) {}
}
