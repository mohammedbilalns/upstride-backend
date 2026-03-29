import type { AppEvent } from "./domain-event";

export class ArticleCommentCreatedEvent implements AppEvent {
	readonly eventName = "article.comment.created";
	readonly occurredAt = new Date();

	constructor(
		public readonly articleId: string,
		public readonly articleSlug: string,
		public readonly articleAuthorId: string,
		public readonly commentId: string,
		public readonly actorId: string,
		public readonly actorName: string,
		public readonly count: number,
		public readonly parentId?: string | null,
	) {}
}
