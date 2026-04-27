import type {
	DeleteArticleCommentInput,
	DeleteArticleCommentOutput,
} from "../dtos/article-input.dto";

export interface IDeleteArticleCommentUseCase {
	execute(
		input: DeleteArticleCommentInput,
	): Promise<DeleteArticleCommentOutput>;
}
