import type {
	CreateArticleInput,
	CreateArticleOutput,
} from "../dtos/article-input.dto";

export interface ICreateArticleUseCase {
	execute(input: CreateArticleInput): Promise<CreateArticleOutput>;
}
