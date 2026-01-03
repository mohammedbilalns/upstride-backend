import { ArticleReadService } from "../../../application/services";
import { ArticleCacheService } from "../../../application/services/article-cache.service";
import { CacheService } from "../../../application/services/cache.service";
import { CreateArticleUC } from "../../../application/useCases/article/write/createArticle.usecase";
import { DeleteArticleUC } from "../../../application/useCases/article/write/deleteArticle.usecase";
import { UpdateArticleUC } from "../../../application/useCases/article/write/updateArticle.usecase";
import type {
	IArticleCommentRepository,
	IArticleRepository,
	IArticleViewRepository,
	IReactionRepository,
	ITagRepository,
} from "../../../domain/repositories";
import type { IArticleReadService } from "../../../domain/services";
import { IArticleCacheService } from "../../../domain/services/article-cache.service.interface";
import type { ICacheService } from "../../../domain/services/cache.service.interface";
import { ICreateArticleUC } from "../../../domain/useCases/article/write/createArticle.usecase.interface";
import { IDeleteArticleUC } from "../../../domain/useCases/article/write/deleteArticle.usecase.interface";
import { IUpdateArticleUC } from "../../../domain/useCases/article/write/updateArticle.usecase.interface";
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
	const articleCacheService: IArticleCacheService = new ArticleCacheService(
		cacheService,
	);
	const articleReadService: IArticleReadService = new ArticleReadService(
		articleRepository,
		articleViewRepository,
		articleReactionRepository,
		cacheService,
	);
	const createArticleUseCase: ICreateArticleUC = new CreateArticleUC(
		articleRepository,
		tagRepository,
		cacheService,
		articleCacheService,
	);
	const updateArticleUseCase: IUpdateArticleUC = new UpdateArticleUC(
		articleRepository,
		tagRepository,
		articleCacheService,
	);
	const deleteArticleUseCase: IDeleteArticleUC = new DeleteArticleUC(
		articleRepository,
		articleCommentRepository,
		tagRepository,
		articleViewRepository,
		articleReactionRepository,
		articleCacheService,
	);

	return new ArticleController(
		articleReadService,
		createArticleUseCase,
		updateArticleUseCase,
		deleteArticleUseCase,
	);
}
