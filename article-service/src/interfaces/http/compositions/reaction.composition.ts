import { ArticleReactionService } from "../../../application/services";
import type {
	IArticleReactionRepository,
	IArticleRepository,
} from "../../../domain/repositories";
import type { IArticleRectionService } from "../../../domain/services";
import {
	ArticleReactionRepository,
	ArticleRepository,
} from "../../../infrastructure/database/repositories";
import { ArticleReactionController } from "../controllers/reaction.controller";

export function createReactionController(): ArticleReactionController {
	const articleReactionRepository: IArticleReactionRepository =
		new ArticleReactionRepository();
	const articleRepository: IArticleRepository = new ArticleRepository();
	const articleReactionService: IArticleRectionService =
		new ArticleReactionService(articleReactionRepository, articleRepository);
	return new ArticleReactionController(articleReactionService);
}
