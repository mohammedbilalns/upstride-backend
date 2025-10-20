import { ReactionService } from "../../../application/services";
import { IEventBus } from "../../../domain/events/eventBus.interface";
import type {
	IArticleCommentRepository,
	IArticleRepository,
	IReactionRepository,
} from "../../../domain/repositories";
import type { IReactionService } from "../../../domain/services";
import {
	ArticleCommentRepository,
	ArticleRepository,
	ReactionRepository,
} from "../../../infrastructure/database/repositories";
import EventBus from "../../../infrastructure/events/eventBus";
import { ReactionController } from "../controllers/reaction.controller";

export function createReactionController(): ReactionController {
	const articleReactionRepository: IReactionRepository =
		new ReactionRepository();
	const articleRepository: IArticleRepository = new ArticleRepository();
	const commentRepository: IArticleCommentRepository =
		new ArticleCommentRepository();
	const eventBus: IEventBus = EventBus;
	const articleReactionService: IReactionService = new ReactionService(
		articleReactionRepository,
		articleRepository,
		commentRepository,
		eventBus,
	);
	return new ReactionController(articleReactionService);
}
