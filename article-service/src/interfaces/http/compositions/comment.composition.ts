import {  IArticleRepository, IArticleCommentRepository } from "../../../domain/repositories";
import { ArticleCommentRepository, ArticleRepository } from "../../../infrastructure/database/repositories";
import { IArticleCommentService } from "../../../domain/services";
import { ArticleCommentService } from "../../../application/services";
import { ArticleCommentController } from "../controllers/comment.controller";

export function createCommentController(): ArticleCommentController {
	const articleCommentRepository: IArticleCommentRepository = new ArticleCommentRepository()
	const articleRepository: IArticleRepository = new ArticleRepository()
	const articleCommentService: IArticleCommentService = new ArticleCommentService(articleCommentRepository, articleRepository)
	return new ArticleCommentController(articleCommentService)
}
