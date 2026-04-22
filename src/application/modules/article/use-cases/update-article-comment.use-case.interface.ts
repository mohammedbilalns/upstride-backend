import type {
	UpdateArticleCommentInput,
	UpdateArticleCommentOutput,
} from "../dtos/article-input.dto";

export interface IUpdateArticleCommentUseCase {
	execute(
		input: UpdateArticleCommentInput,
	): Promise<UpdateArticleCommentOutput>;
}
