import {  IArticleRepository, ITagRepository, IArticleViewRepository, IArticleReactionRepository } from "../../../domain/repositories";
import { ArticleRepository,TagRepository,ArticleViewRepository, ArticleReactionRepository } from "../../../infrastructure/database/repositories";
import { IArticleService } from "../../../domain/services";
import { ArticleService } from "../../../application/services";
import { ArticleController } from "../controllers/article.controller";


export function createArticleController(): ArticleController {

	const articleRepository: IArticleRepository = new ArticleRepository()
	const tagRepository: ITagRepository = new TagRepository()
	const articleViewRepository: IArticleViewRepository = new ArticleViewRepository()
	const articleReactionRepository: IArticleReactionRepository = new ArticleReactionRepository()
	const articleService: IArticleService = new ArticleService(articleRepository, tagRepository, articleViewRepository, articleReactionRepository)
	return new ArticleController(articleService)
}
