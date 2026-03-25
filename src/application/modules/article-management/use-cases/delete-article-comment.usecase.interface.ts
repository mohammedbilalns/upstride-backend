import type { DeleteArticleCommentInput } from "../dtos/article-input.dto";

export interface IDeleteArticleCommentUseCase {
	execute(input: DeleteArticleCommentInput): Promise<void>;
}
