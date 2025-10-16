import type {
	ArticleCommentDto,
	ArticleCommentUpdateDto,
	fetchCommentsDto,
	fetchCommentsResponseDto,
} from "../../application/dtos/articleComment.dto";

export interface IArticleCommentService {
	createComment(articleCommentDto: ArticleCommentDto): Promise<void>;
	updateComment(
		articleCommentUpdateDto: ArticleCommentUpdateDto,
	): Promise<void>;
	getComments(
		fetchCommentsDto: fetchCommentsDto,
	): Promise<fetchCommentsResponseDto>;
	deleteComment(id: string, userId: string): Promise<void>;
}
