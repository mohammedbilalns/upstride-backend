import type { GetArticleTopTagsOutput } from "../dtos/article-top-tags.dto";

export interface IGetArticleTopTagsUseCase {
	execute(viewerUserId?: string): Promise<GetArticleTopTagsOutput>;
}
