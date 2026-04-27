import { inject, injectable } from "inversify";
import type { IArticleRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { GetArticleTopTagsOutput } from "../dtos/article-top-tags.dto";
import type { IGetArticleTopTagsUseCase } from "./get-article-top-tags.use-case.interface";

const DEFAULT_TOP_TAGS_LIMIT = 10;

@injectable()
export class GetArticleTopTagsUseCase implements IGetArticleTopTagsUseCase {
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
	) {}

	async execute(viewerUserId?: string): Promise<GetArticleTopTagsOutput> {
		const tags = await this._articleRepository.getTopTags(
			DEFAULT_TOP_TAGS_LIMIT,
			viewerUserId,
		);
		return { tags };
	}
}
