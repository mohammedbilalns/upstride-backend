import { AppEvent } from "./app-event";

export class ArticleBlockedEvent extends AppEvent {
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
