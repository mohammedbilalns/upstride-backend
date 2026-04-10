import type { ArticleReactionType } from "../entities/article-reaction.entity";
import { AppEvent } from "./app-event";

export class ArticleReactionCreatedEvent extends AppEvent {
	readonly eventName = "article.reaction.created";

	constructor(
		public readonly payload: {
			articleId: string;
			articleSlug: string;
			articleAuthorId: string;
			reactionType: ArticleReactionType;
			actorId: string;
			actorName: string;
			count: number;
		},
	) {
		super();
	}
}
