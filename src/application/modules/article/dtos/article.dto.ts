export interface ArticleAuthorSnapshotDto {
	name: string;
	interests?: string[];
	avatarUrl?: string;
	isBlocked?: boolean;
}

export interface ArticleDto {
	id: string;
	authorId: string;
	authorSnapshot: ArticleAuthorSnapshotDto;
	slug: string;
	featuredImageUrl: string;
	featuredImageId: string;
	title: string;
	description: string;
	previewContent: string;
	tags: string[];
	views: number;
	commentsCount: number;
	likesCount: number;
	isBlockedByAdmin: boolean;
	blockingReason: string | null;
	blockedAt: string | null;
	createdAt: string;
}
