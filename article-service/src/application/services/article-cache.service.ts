import { IArticleCacheService } from "../../domain/services/article-cache.service.interface";
import { ICacheService } from "../../domain/services/cache.service.interface";
import { ArticleCacheConstants } from "../utils/cacheUtils";

export class ArticleCacheService implements IArticleCacheService {
	constructor(private _cacheService: ICacheService) {}

	public async invalidateListCache(): Promise<void> {
		await this._cacheService.delByPattern(
			`${ArticleCacheConstants.ARTICLES_LIST_CACHE_PREFIX}*`,
		);
	}

	public async clearArticleCache(articleId: string): Promise<void> {
		const contentKey = `${ArticleCacheConstants.CONTENT_CACHE_PREFIX}${articleId}`;
		await this._cacheService.del(contentKey);
		await this.invalidateListCache();
	}
}
