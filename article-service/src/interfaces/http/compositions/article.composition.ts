import { ArticleService } from "../../../application/services";
import type {
	IReactionRepository,
	IArticleRepository,
	IArticleViewRepository,
	ITagRepository,
} from "../../../domain/repositories";
import type { IArticleService } from "../../../domain/services";
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
	const articleService: IArticleService = new ArticleService(
		articleRepository,
		tagRepository,
		articleViewRepository,
		articleReactionRepository,
		redisClient
	);
	return new ArticleController(articleService);
}
