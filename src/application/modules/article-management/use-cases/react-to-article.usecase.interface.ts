import type {
	ReactToArticleInput,
	ReactToArticleOutput,
} from "../dtos/article-input.dto";

export interface IReactToArticleUseCase {
	execute(input: ReactToArticleInput): Promise<ReactToArticleOutput>;
}
