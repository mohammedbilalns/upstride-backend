import { ArticleCommentService } from "../../../application/services";
import { IEventBus } from "../../../domain/events/eventBus.interface";
import type {
	IArticleCommentRepository,
	IArticleRepository,
	IReactionRepository,
} from "../../../domain/repositories";
import type { IArticleCommentService } from "../../../domain/services";
import {
	ArticleCommentRepository,
	ArticleRepository,
	ReactionRepository,
} from "../../../infrastructure/database/repositories";
import EventBus from "../../../infrastructure/events/eventBus";
import { ArticleCommentController } from "../controllers/comment.controller";

export function createCommentController(): ArticleCommentController {
	const articleCommentRepository: IArticleCommentRepository =
		new ArticleCommentRepository();
	const articleRepository: IArticleRepository = new ArticleRepository();
	const reactionRepository: IReactionRepository = new ReactionRepository();
	const eventBus: IEventBus = EventBus;
	const articleCommentService: IArticleCommentService =
		new ArticleCommentService(
			articleCommentRepository,
			articleRepository,
			reactionRepository,
			eventBus
		);
	return new ArticleCommentController(articleCommentService);
}
