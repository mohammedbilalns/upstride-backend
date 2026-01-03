export interface IArticleCacheService {
	invalidateListCache(): Promise<void>;
	clearArticleCache(articleId: string): Promise<void>;
}
