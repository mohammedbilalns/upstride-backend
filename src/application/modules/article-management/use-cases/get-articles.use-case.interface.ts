import type {
	GetArticlesInput,
	GetArticlesOutput,
} from "../dtos/article-input.dto";

export interface IGetArticlesUseCase {
	execute(input: GetArticlesInput): Promise<GetArticlesOutput>;
}
