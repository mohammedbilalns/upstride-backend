import type { MarkArticleViewInput } from "../dtos/article-input.dto";

export interface IMarkArticleViewUseCase {
	execute(input: MarkArticleViewInput): Promise<void>;
}
