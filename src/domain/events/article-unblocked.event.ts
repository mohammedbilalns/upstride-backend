import { DomainEvent } from "./domain-event";

export class ArticleUnblockedEvent extends DomainEvent {
	readonly eventName = "article.unblocked";

	constructor(
		public readonly payload: {
			articleId: string;
			authorId: string;
		},
	) {
		super();
	}
}
