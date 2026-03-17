import { DomainEvent } from "./domain-event";

export class UserCommentedOnArticleEvent extends DomainEvent {
	constructor(
		public readonly articleId: string,
		public readonly userId: string,
	) {
		super();
	}
}
