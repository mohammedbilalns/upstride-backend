import { ReactionService } from "../../../application/services";
import type {
	IReactionRepository,
	IArticleRepository,
    IArticleCommentRepository,
} from "../../../domain/repositories";
import type { IReactionService } from "../../../domain/services";
import {
	ReactionRepository,
	ArticleRepository,
    ArticleCommentRepository,
} from "../../../infrastructure/database/repositories";
import { ReactionController } from "../controllers/reaction.controller";

export function createReactionController(): ReactionController {
	const articleReactionRepository: IReactionRepository =
		new ReactionRepository();
	const articleRepository: IArticleRepository = new ArticleRepository();
	const commentRepository: IArticleCommentRepository = new ArticleCommentRepository()
	const articleReactionService: IReactionService =
		new ReactionService(articleReactionRepository, articleRepository, commentRepository);
	return new ReactionController(articleReactionService);
}
