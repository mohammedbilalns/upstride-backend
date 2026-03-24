export class ArticleComment {
	constructor(
		public readonly id: string,
		public readonly articleId: string,
		public readonly parentId: string | null,
		public readonly userId: string,
		public readonly likesCount: number,
		public readonly repliesCount: number,
		public readonly content: string,
		public readonly isActive: boolean,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
	) {}
}
