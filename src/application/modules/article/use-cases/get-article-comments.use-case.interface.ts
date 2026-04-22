import type {
	GetArticleCommentsInput,
	GetArticleCommentsOutput,
} from "../dtos/article-input.dto";

export interface IGetArticleCommentsUseCase {
	execute(input: GetArticleCommentsInput): Promise<GetArticleCommentsOutput>;
}
