import type {
	GetArticleInput,
	GetArticleOutput,
} from "../dtos/article-input.dto";

export interface IGetArticleUseCase {
	execute(input: GetArticleInput): Promise<GetArticleOutput>;
}
