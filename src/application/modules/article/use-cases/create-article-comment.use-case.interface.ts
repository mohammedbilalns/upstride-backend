import type {
	CreateArticleCommentInput,
	CreateArticleCommentOutput,
} from "../dtos/article-input.dto";

export interface ICreateArticleCommentUseCase {
	execute(
		input: CreateArticleCommentInput,
	): Promise<CreateArticleCommentOutput>;
}
