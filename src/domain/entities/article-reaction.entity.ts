export const ArticleReactionTypeValues = ["LIKE"] as const;
export type ArticleReactionType = (typeof ArticleReactionTypeValues)[number];

export class ArticleReaction {
	constructor(
		public readonly id: string,
		public readonly resourceId: string,
		public readonly userId: string,
		public readonly reactionType: ArticleReactionType,
		public readonly createdAt: Date | null,
	) {}
}
