import { DomainEvent } from "./domain-event";

export class ArticleBlockedEvent extends DomainEvent {
	readonly eventName = "article.blocked";

	constructor(
		public readonly payload: {
			articleId: string;
			authorId: string;
			reason: string;
		},
	) {
		super();
	}
}
