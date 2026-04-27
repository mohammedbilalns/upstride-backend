import { DomainEvent } from "./domain-event";

export class UserCommentedOnArticleEvent extends DomainEvent {
	readonly eventName = "user.commented.on.article";

	constructor(
		public readonly payload: {
			articleId: string;
			userId: string;
		},
	) {
		super();
	}
}
