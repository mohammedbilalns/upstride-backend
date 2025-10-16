import { ArticleCommentService } from "../../../application/services";
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
import { ArticleCommentController } from "../controllers/comment.controller";

export function createCommentController(): ArticleCommentController {
	const articleCommentRepository: IArticleCommentRepository =
		new ArticleCommentRepository();
	const articleRepository: IArticleRepository = new ArticleRepository();
	const reactionRepository: IReactionRepository = new ReactionRepository();
	const articleCommentService: IArticleCommentService =
		new ArticleCommentService(
			articleCommentRepository,
			articleRepository,
			reactionRepository,
		);
	return new ArticleCommentController(articleCommentService);
}
