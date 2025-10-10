import { ReactionService } from "../../../application/services";
import type {
	IReactionRepository,
	IArticleRepository,
} from "../../../domain/repositories";
import type { IReactionService } from "../../../domain/services";
import {
	ReactionRepository,
	ArticleRepository,
} from "../../../infrastructure/database/repositories";
import { ReactionController } from "../controllers/reaction.controller";

export function createReactionController(): ReactionController {
	const articleReactionRepository: IReactionRepository =
		new ReactionRepository();
	const articleRepository: IArticleRepository = new ArticleRepository();
	const articleReactionService: IReactionService =
		new ReactionService(articleReactionRepository, articleRepository);
	return new ReactionController(articleReactionService);
}
