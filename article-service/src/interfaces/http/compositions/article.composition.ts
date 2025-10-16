import {
	ArticleReadService,
	ArticleWriteService,
} from "../../../application/services";
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
	const articleReadService: IArticleReadService = new ArticleReadService(
		articleRepository,
		articleViewRepository,
		articleReactionRepository,
		redisClient,
	);
	const articleWriteService: IArticleWriteService = new ArticleWriteService(
		articleRepository,
		tagRepository,
		articleViewRepository,
		articleCommentRepository,
		articleReactionRepository,
		redisClient,
	);
	return new ArticleController(articleReadService, articleWriteService);
}
