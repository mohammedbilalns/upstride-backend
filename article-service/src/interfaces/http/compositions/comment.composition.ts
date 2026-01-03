import { CreateCommentUC } from "../../../application/useCases/comments/createComment.usecase";
import { DeleteCommentUC } from "../../../application/useCases/comments/deleteComment.usecase";
import { GetCommentsUC } from "../../../application/useCases/comments/getComments.usecase";
import { UpdateCommentUC } from "../../../application/useCases/comments/updateComment.usecase";
import type { IEventBus } from "../../../domain/events/eventBus.interface";
import type {
	IArticleCommentRepository,
	IArticleRepository,
	IReactionRepository,
} from "../../../domain/repositories";
import { ICreateCommentUc } from "../../../domain/useCases/comments/createComment.usecase.interface";
import { IDeleteCommentUC } from "../../../domain/useCases/comments/deleteComment.usecase.interface";
import { IGetCommentsUC } from "../../../domain/useCases/comments/getComments.usecase.interface";
import { IUpdateCommentUC } from "../../../domain/useCases/comments/updateComment.usecase.interface";
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
	// use cases
	const createCommentUC: ICreateCommentUc = new CreateCommentUC(
		articleRepository,
		articleCommentRepository,
		eventBus,
	);

	const updateCommentUC: IUpdateCommentUC = new UpdateCommentUC(
		articleCommentRepository,
	);

	const deleteCommentUC: IDeleteCommentUC = new DeleteCommentUC(
		articleCommentRepository,
		articleRepository,
	);

	const getCommentsUC: IGetCommentsUC = new GetCommentsUC(
		articleRepository,
		articleCommentRepository,
		reactionRepository,
	);

	return new ArticleCommentController(
		createCommentUC,
		updateCommentUC,
		deleteCommentUC,
		getCommentsUC,
	);
}
