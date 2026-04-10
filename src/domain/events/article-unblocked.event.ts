import { AppEvent } from "./app-event";

export class ArticleUnblockedEvent extends AppEvent {
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
