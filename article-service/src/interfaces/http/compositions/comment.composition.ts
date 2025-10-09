import { ArticleCommentService } from "../../../application/services";
import type {
	IArticleCommentRepository,
	IArticleRepository,
} from "../../../domain/repositories";
import type { IArticleCommentService } from "../../../domain/services";
import {
	ArticleCommentRepository,
	ArticleRepository,
} from "../../../infrastructure/database/repositories";
import { ArticleCommentController } from "../controllers/comment.controller";

export function createCommentController(): ArticleCommentController {
	const articleCommentRepository: IArticleCommentRepository =
		new ArticleCommentRepository();
	const articleRepository: IArticleRepository = new ArticleRepository();
	const articleCommentService: IArticleCommentService =
		new ArticleCommentService(articleCommentRepository, articleRepository);
	return new ArticleCommentController(articleCommentService);
}
