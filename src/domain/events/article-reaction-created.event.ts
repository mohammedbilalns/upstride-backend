import type { ArticleReactionType } from "../entities/article-reaction.entity";
import { DomainEvent } from "./domain-event";

export class ArticleReactionCreatedEvent extends DomainEvent {
	readonly eventName = "article.reaction.created";

	constructor(
		public readonly payload: {
			articleId: string;
			articleSlug: string;
			articleAuthorId: string;
			reactionType: ArticleReactionType;
			actorId: string;
			actorName: string;
			count: number;
		},
	) {
		super();
	}
}
