import { ErrorMessage, HttpStatus } from "../../../../common/enums";
import {
	IArticleRepository,
	ITagRepository,
} from "../../../../domain/repositories";
import { IArticleCacheService } from "../../../../domain/services/article-cache.service.interface";
import { ICacheService } from "../../../../domain/services/cache.service.interface";
import { ICreateArticleUC } from "../../../../domain/useCases/article/write/create-article.usecase.interface";
import { CreateArticleDto } from "../../../dtos/article.dto";
import { AppError } from "../../../errors/app-error";
import { generateDescription } from "../../../utils/generate-description";

export class CreateArticleUC implements ICreateArticleUC {
	constructor(
		private _articleRepository: IArticleRepository,
		private _tagRepository: ITagRepository,
		private _cacheService: ICacheService,
		private _articleCacheService: IArticleCacheService,
	) {}

	async execute(articleData: CreateArticleDto): Promise<void> {
		const cachedAuthor: { profilePicture: string } | null =
			await this._cacheService.get(`user:${articleData.author}`);
		const authorImage = cachedAuthor?.profilePicture;

		// check if authorRole is mentor
		if (articleData.authorRole !== "mentor")
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
		// create tags
		const tagIds = await this._tagRepository.createOrIncrement(
			articleData.tags,
		);
		// generate description
		const description = generateDescription(articleData.content);

		await this._articleRepository.create({
			content: articleData.content,
			description,
			author: articleData.author,
			authorImage,
			featuredImage: articleData.featuredImage?.secure_url,
			featuredImageId: articleData.featuredImage?.public_id,
			authorName: articleData.authorName,
			title: articleData.title,
			tags: tagIds,
		});

		await this._articleCacheService.invalidateListCache();
	}
}
