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
		public readonly createdAt: Date | null,
		public readonly updatedAt: Date | null,
	) {}

	incrementLikes(): Partial<ArticleComment> {
		const current = this.likesCount ?? 0;
		return { likesCount: current + 1 } as Partial<ArticleComment>;
	}

	decrementLikes(): Partial<ArticleComment> {
		const current = this.likesCount ?? 0;
		return { likesCount: Math.max(0, current - 1) } as Partial<ArticleComment>;
	}
}
