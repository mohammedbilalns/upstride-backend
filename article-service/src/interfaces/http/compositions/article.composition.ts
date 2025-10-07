import { ArticleService } from "../../../application/services";
import type {
	IArticleReactionRepository,
	IArticleRepository,
	IArticleViewRepository,
	ITagRepository,
} from "../../../domain/repositories";
import type { IArticleService } from "../../../domain/services";
import {
	ArticleReactionRepository,
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
	const articleReactionRepository: IArticleReactionRepository =
		new ArticleReactionRepository();
	const articleService: IArticleService = new ArticleService(
		articleRepository,
		tagRepository,
		articleViewRepository,
		articleReactionRepository,
	);
	return new ArticleController(articleService);
}
