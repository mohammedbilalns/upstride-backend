export interface ArticleAuthorSnapshotDto {
	name: string;
	avatarUrl: string;
}

export interface ArticleDto {
	id: string;
	authorId: string;
	authorSnapshot: ArticleAuthorSnapshotDto;
	slug: string;
	featuredImageUrl: string;
	title: string;
	description: string;
	previewContent: string;
	tags: string[];
	isActive: boolean;
	views: number;
	commentsCount: number;
	isArchived: boolean;
	createdAt: Date;
	updatedAt: Date;
}
