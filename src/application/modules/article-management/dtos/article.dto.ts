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
	featuredImageId: string;
	title: string;
	description: string;
	previewContent: string;
	tags: string[];
	views: number;
	commentsCount: number;
	createdAt: Date;
}
