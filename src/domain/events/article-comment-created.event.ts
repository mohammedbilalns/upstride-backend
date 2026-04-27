import { DomainEvent } from "./domain-event";

export class ArticleCommentCreatedEvent extends DomainEvent {
	readonly eventName = "article.comment.created";

	constructor(
		public readonly payload: {
			articleId: string;
			articleSlug: string;
			articleAuthorId: string;
			commentId: string;
			actorId: string;
			actorName: string;
			count: number;
			parentId?: string | null;
		},
	) {
		super();
	}
}
