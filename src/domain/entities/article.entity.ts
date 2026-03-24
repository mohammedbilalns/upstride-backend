import { EntityValidationError } from "../errors";

export class Article {
	constructor(
		public readonly id: string,
		public readonly authorId: string,
		public readonly authorSnapshot: { name: string; avatarUrl: string },
		public readonly featuredImageUrl: string,
		public readonly title: string,
		public readonly description: string,
		public readonly previewContent: string,
		public readonly tags: string[],
		public readonly isActive: boolean,
		public readonly views: number,
		public readonly commentsCount: number,
		public readonly isArchived: boolean,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
	) {
		if (tags.length > 6) {
			throw new EntityValidationError("tags", "maximum 6 tags allowed");
		}
	}
}
