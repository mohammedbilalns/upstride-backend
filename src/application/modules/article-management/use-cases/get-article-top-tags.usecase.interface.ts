import type { GetArticleTopTagsOutput } from "../dtos/article-top-tags.dto";

export interface IGetArticleTopTagsUseCase {
	execute(): Promise<GetArticleTopTagsOutput>;
}
