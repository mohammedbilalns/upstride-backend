import type {
	ReactToArticleCommentInput,
	ReactToArticleCommentOutput,
} from "../dtos/article-input.dto";

export interface IReactToArticleCommentUseCase {
	execute(
		input: ReactToArticleCommentInput,
	): Promise<ReactToArticleCommentOutput>;
}
