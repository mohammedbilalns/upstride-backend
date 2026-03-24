import { AppEvent } from "./domain-event";

export class UserCommentedOnArticleEvent extends AppEvent {
	constructor(
		public readonly articleId: string,
		public readonly userId: string,
	) {
		super();
	}
}
