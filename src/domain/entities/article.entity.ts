import { EntityValidationError } from "../errors";
import type { UserRole } from "./user.entity";

export class Article {
	constructor(
		public readonly id: string,
		public readonly authorId: string,
		public readonly authorSnapshot: {
			name: string;
			avatarUrl?: string;
			isBlocked?: boolean;
		},
		public readonly slug: string,
		public readonly featuredImageUrl: string,
		public readonly title: string,
		public readonly description: string,
		public readonly previewContent: string,
		public readonly tags: string[],
		public readonly isActive: boolean,
		public readonly views: number,
		public readonly commentsCount: number,
		public readonly likesCount: number,
		public readonly isArchived: boolean,
		public readonly isBlockedByAdmin: boolean = false,
		public readonly blockingReason: string | null = null,
		public readonly blockedAt: Date | null = null,
		public readonly blockedByReportId: string | null = null,
		public readonly createdAt: Date | null,
		public readonly updatedAt: Date | null,
	) {
		if (tags.length > 6) {
			throw new EntityValidationError("tags", "maximum 6 tags allowed");
		}
	}

	/**
	 * Asserts that the given actor is allowed to update this article.
	 */
	canUpdate(actorRole: UserRole, actorId: string): void {
		if (actorRole !== "MENTOR") {
			throw new EntityValidationError(
				"Article",
				"Only mentors can update articles.",
			);
		}
		if (this.authorId !== actorId) {
			throw new EntityValidationError(
				"Article",
				"You can only update your own articles.",
			);
		}
	}

	/**
	 * Asserts that the given actor is allowed to delete this article.
	 */
	canDelete(actorId: string): void {
		if (this.isBlockedByAdmin) {
			throw new EntityValidationError(
				"Article",
				"Blocked articles cannot be deleted.",
			);
		}
		if (!this.isActive) {
			throw new EntityValidationError("Article", "Article not found.");
		}
		if (this.authorId !== actorId) {
			throw new EntityValidationError(
				"Article",
				"You can only delete your own articles.",
			);
		}
	}

	/**
	 * Returns a partial update payload representing a blocked state.
	 */
	block(reason: string, reportId: string | null): Partial<Article> {
		return {
			isActive: false,
			isArchived: true,
			isBlockedByAdmin: true,
			blockingReason: reason,
			blockedAt: new Date(),
			blockedByReportId: reportId,
		} as Partial<Article>;
	}
}
