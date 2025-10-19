import {
	ArticleReadService,
	ArticleWriteService,
} from "../../../application/services";
import { CacheService } from "../../../application/services/cache.service";
import type {
	IArticleCommentRepository,
	IArticleRepository,
	IArticleViewRepository,
	IReactionRepository,
	ITagRepository,
} from "../../../domain/repositories";
import type {
	IArticleReadService,
	IArticleWriteService,
} from "../../../domain/services";
import type { ICacheService } from "../../../domain/services/cache.service.interface";
import { redisClient } from "../../../infrastructure/config";
import {
	ArticleCommentRepository,
	ArticleRepository,
	ArticleViewRepository,
	ReactionRepository,
	TagRepository,
} from "../../../infrastructure/database/repositories";
import { ArticleController } from "../controllers/article.controller";

export function createArticleController(): ArticleController {
	const articleRepository: IArticleRepository = new ArticleRepository();
	const tagRepository: ITagRepository = new TagRepository();
	const articleViewRepository: IArticleViewRepository =
		new ArticleViewRepository();
	const articleReactionRepository: IReactionRepository =
		new ReactionRepository();
	const articleCommentRepository: IArticleCommentRepository =
		new ArticleCommentRepository();
	const cacheService: ICacheService = new CacheService(redisClient);
	const articleReadService: IArticleReadService = new ArticleReadService(
		articleRepository,
		articleViewRepository,
		articleReactionRepository,
		cacheService,
	);
	const articleWriteService: IArticleWriteService = new ArticleWriteService(
		articleRepository,
		tagRepository,
		articleViewRepository,
		articleCommentRepository,
		articleReactionRepository,
		cacheService,
	);
	return new ArticleController(articleReadService, articleWriteService);
}
