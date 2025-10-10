import { ArticleReadService, ArticleWriteService  } from "../../../application/services";
import type {
	IReactionRepository,
	IArticleRepository,
	IArticleViewRepository,
	ITagRepository,
} from "../../../domain/repositories";
import type { IArticleReadService, IArticleWriteService } from "../../../domain/services";
import { redisClient } from "../../../infrastructure/config";
import {
	ReactionRepository,
	ArticleRepository,
	ArticleViewRepository,
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
	const articleReadService: IArticleReadService = new ArticleReadService(
		articleRepository,
		articleViewRepository,
		articleReactionRepository,
		redisClient
	);
	const articleWriteService: IArticleWriteService = new ArticleWriteService(
		articleRepository,
		tagRepository,
		redisClient
	);
	return new ArticleController(articleReadService, articleWriteService);
}
