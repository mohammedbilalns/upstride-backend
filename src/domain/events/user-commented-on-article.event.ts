import { AppEvent } from "./app-event";

export class UserCommentedOnArticleEvent extends AppEvent {
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
