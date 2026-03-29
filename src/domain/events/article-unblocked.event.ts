import { AppEvent } from "./domain-event";

export class ArticleUnblockedEvent extends AppEvent {
	constructor(
		public readonly articleId: string,
		public readonly authorId: string,
	) {
		super();
	}
}
