import { ErrorMessage, HttpStatus } from "../../../../common/enums";
import {
	IArticleRepository,
	ITagRepository,
} from "../../../../domain/repositories";
import { IArticleCacheService } from "../../../../domain/services/article-cache.service.interface";
import { ICacheService } from "../../../../domain/services/cache.service.interface";
import { ICreateArticleUC } from "../../../../domain/useCases/article/write/createArticle.usecase.interface";
import { CreateArticleDto } from "../../../dtos/article.dto";
import { AppError } from "../../../errors/AppError";
import { generateDescription } from "../../../utils/generateDescription";

export class CreateArticleUC implements ICreateArticleUC {
	constructor(
		private _articleRepository: IArticleRepository,
		private _tagRepository: ITagRepository,
		private _cacheService: ICacheService,
		private _articleCacheService: IArticleCacheService,
	) {}

	async execute(dto: CreateArticleDto): Promise<void> {
		const cachedAuthor: { profilePicture: string } | null =
			await this._cacheService.get(`user:${dto.author}`);
		const authorImage = cachedAuthor?.profilePicture;

		// check if authorRole is mentor
		if (dto.authorRole !== "mentor")
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
		// create tags
		const tagIds = await this._tagRepository.createOrIncrement(dto.tags);
		// generate description
		const description = generateDescription(dto.content);

		await this._articleRepository.create({
			content: dto.content,
			description,
			author: dto.author,
			authorImage,
			featuredImage: dto.featuredImage?.secure_url,
			featuredImageId: dto.featuredImage?.public_id,
			authorName: dto.authorName,
			title: dto.title,
			tags: tagIds,
		});

		await this._articleCacheService.invalidateListCache();
	}
}
