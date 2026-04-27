import type { ArticleReactionType } from "../entities/article-reaction.entity";
import { DomainEvent } from "./domain-event";

export class ArticleCommentReactionCreatedEvent extends DomainEvent {
	readonly eventName = "article.comment.reaction.created";

	constructor(
		public readonly payload: {
			articleId: string;
			articleSlug: string;
			articleAuthorId: string;
			commentId: string;
			reactionType: ArticleReactionType;
			actorId: string;
			actorName: string;
			count: number;
		},
	) {
		super();
	}
}
