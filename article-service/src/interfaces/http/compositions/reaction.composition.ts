import {  IArticleRepository, IArticleReactionRepository } from "../../../domain/repositories";
import { ArticleReactionRepository, ArticleRepository } from "../../../infrastructure/database/repositories";
import { IArticleRectionService } from "../../../domain/services";
import { ArticleReactionService } from "../../../application/services";
import { ArticleReactionController } from "../controllers/reaction.controller";

export function createReactionController(): ArticleReactionController {
	const articleReactionRepository: IArticleReactionRepository = new ArticleReactionRepository()
	const articleRepository: IArticleRepository = new ArticleRepository()
	const articleReactionService: IArticleRectionService = new ArticleReactionService(articleReactionRepository, articleRepository)
	return new ArticleReactionController(articleReactionService)
}
