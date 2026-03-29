import { AppEvent } from "./domain-event";

export class ArticleBlockedEvent extends AppEvent {
	constructor(
		public readonly articleId: string,
		public readonly authorId: string,
		public readonly reason: string,
	) {
		super();
	}
}
