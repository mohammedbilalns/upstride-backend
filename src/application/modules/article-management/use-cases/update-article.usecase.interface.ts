import type {
	UpdateArticleInput,
	UpdateArticleOutput,
} from "../dtos/article-input.dto";

export interface IUpdateArticleUseCase {
	execute(input: UpdateArticleInput): Promise<UpdateArticleOutput>;
}
