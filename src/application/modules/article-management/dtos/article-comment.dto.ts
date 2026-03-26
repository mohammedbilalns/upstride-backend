import type { ArticleAuthorSnapshotDto } from "./article.dto";

export interface ArticleCommentDto {
	id: string;
	articleId: string;
	parentId: string | null;
	userId: string;
	authorSnapshot: ArticleAuthorSnapshotDto;
	likesCount: number;
	repliesCount: number;
	content: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}
