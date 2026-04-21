import type { DeleteArticleInput } from "../dtos/article-input.dto";

export interface IDeleteArticleUseCase {
	execute(input: DeleteArticleInput): Promise<void>;
}
