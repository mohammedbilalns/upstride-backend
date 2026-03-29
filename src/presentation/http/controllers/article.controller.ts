import type { Response } from "express";
import { inject, injectable } from "inversify";
import type {
	CreateArticleCommentInput,
	DeleteArticleCommentInput,
	DeleteArticleInput,
	GetArticleCommentsInput,
	GetArticleInput,
	GetArticlesInput,
	ReactToArticleCommentInput,
	ReactToArticleInput,
	UpdateArticleCommentInput,
} from "../../../application/modules/article-management/dtos/article-input.dto";
import type {
	ICreateArticleCommentUseCase,
	ICreateArticleUseCase,
	IDeleteArticleCommentUseCase,
	IDeleteArticleUseCase,
	IGetArticleCommentsUseCase,
	IGetArticlesUseCase,
	IGetArticleTopTagsUseCase,
	IGetArticleUseCase,
	IReactToArticleCommentUseCase,
	IReactToArticleUseCase,
	IUpdateArticleCommentUseCase,
	IUpdateArticleUseCase,
} from "../../../application/modules/article-management/use-cases";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class ArticleController {
	constructor(
		@inject(TYPES.UseCases.GetArticles)
		private readonly _getArticlesUseCase: IGetArticlesUseCase,
		@inject(TYPES.UseCases.GetArticle)
		private readonly _getArticleUseCase: IGetArticleUseCase,
		@inject(TYPES.UseCases.CreateArticle)
		private readonly _createArticleUseCase: ICreateArticleUseCase,
		@inject(TYPES.UseCases.UpdateArticle)
		private readonly _updateArticleUseCase: IUpdateArticleUseCase,
		@inject(TYPES.UseCases.DeleteArticle)
		private readonly _deleteArticleUseCase: IDeleteArticleUseCase,
		@inject(TYPES.UseCases.CreateArticleComment)
		private readonly _createArticleCommentUseCase: ICreateArticleCommentUseCase,
		@inject(TYPES.UseCases.UpdateArticleComment)
		private readonly _updateArticleCommentUseCase: IUpdateArticleCommentUseCase,
		@inject(TYPES.UseCases.DeleteArticleComment)
		private readonly _deleteArticleCommentUseCase: IDeleteArticleCommentUseCase,
		@inject(TYPES.UseCases.GetArticleComments)
		private readonly _getArticleCommentsUseCase: IGetArticleCommentsUseCase,
		@inject(TYPES.UseCases.ReactToArticle)
		private readonly _reactToArticleUseCase: IReactToArticleUseCase,
		@inject(TYPES.UseCases.ReactToArticleComment)
		private readonly _reactToArticleCommentUseCase: IReactToArticleCommentUseCase,
		@inject(TYPES.UseCases.GetArticleTopTags)
		private readonly _getTopTagsUseCase: IGetArticleTopTagsUseCase,
	) {}

	getTopTags = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const data = await this._getTopTagsUseCase.execute(req.user?.id);
			return sendSuccess(res, HttpStatus.OK, { data });
		},
	);

	getArticles = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const query = req.validated?.query as GetArticlesInput;
			const data = await this._getArticlesUseCase.execute({
				...query,
				viewerUserId: req.user?.id,
			});
			return sendSuccess(res, HttpStatus.OK, { data });
		},
	);

	getMentorArticles = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const query = req.validated?.query as GetArticlesInput;
			const data = await this._getArticlesUseCase.execute({
				...query,
				authorId: req.user.id,
				isMentorView: true,
			});
			return sendSuccess(res, HttpStatus.OK, { data });
		},
	);

	getArticle = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { slug } = req.validated?.params as { slug: string };
			const data = await this._getArticleUseCase.execute({
				slug,
				viewerUserId: req.user.id,
			} as GetArticleInput);
			return sendSuccess(res, HttpStatus.OK, { data });
		},
	);

	getArticleForEdit = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { articleId } = req.validated?.params as { articleId: string };
			const result = await this._getArticlesUseCase.execute({
				page: 1,
				isMentorView: true,
				authorId: req.user.id,
				ids: [articleId],
			} as any);
			const article = result.items[0];
			if (!article) {
				return sendSuccess(res, HttpStatus.NOT_FOUND, {
					message: "Article not found or not owned by user",
				});
			}
			return sendSuccess(res, HttpStatus.OK, { data: { article } });
		},
	);

	createArticle = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const body = req.validated?.body as {
				title: string;
				description: string;
				featuredImageUrl: string;
				tags?: string[];
			};
			const data = await this._createArticleUseCase.execute({
				userId: req.user.id,
				title: body.title,
				description: body.description,
				featuredImageUrl: body.featuredImageUrl,
				tags: body.tags,
			});
			return sendSuccess(res, HttpStatus.CREATED, { data });
		},
	);

	updateArticle = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { articleId } = req.validated?.params as { articleId: string };
			const body = req.validated?.body as {
				title?: string;
				description?: string;
				featuredImageUrl?: string;
				tags?: string[];
				isArchived?: boolean;
			};
			const data = await this._updateArticleUseCase.execute({
				userId: req.user.id,
				articleId,
				title: body.title,
				description: body.description,
				featuredImageUrl: body.featuredImageUrl,
				tags: body.tags,
				isArchived: body.isArchived,
			});
			return sendSuccess(res, HttpStatus.OK, { data });
		},
	);

	deleteArticle = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { articleId } = req.validated?.params as { articleId: string };
			await this._deleteArticleUseCase.execute({
				userId: req.user.id,
				articleId,
			} as DeleteArticleInput);
			return sendSuccess(res, HttpStatus.OK);
		},
	);

	createComment = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { articleId } = req.validated?.params as { articleId: string };
			const body = req.validated?.body as {
				content: string;
				parentId?: string | null;
			};
			const data = await this._createArticleCommentUseCase.execute({
				userId: req.user.id,
				articleId,
				content: body.content,
				parentId: body.parentId ?? null,
			} as CreateArticleCommentInput);
			return sendSuccess(res, HttpStatus.CREATED, { data });
		},
	);

	updateComment = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { commentId } = req.validated?.params as { commentId: string };
			const body = req.validated?.body as UpdateArticleCommentInput;
			const data = await this._updateArticleCommentUseCase.execute({
				userId: req.user.id,
				commentId,
				content: body.content,
			} as UpdateArticleCommentInput);
			return sendSuccess(res, HttpStatus.OK, { data });
		},
	);

	deleteComment = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { commentId } = req.validated?.params as { commentId: string };
			await this._deleteArticleCommentUseCase.execute({
				userId: req.user.id,
				commentId,
			} as DeleteArticleCommentInput);
			return sendSuccess(res, HttpStatus.OK);
		},
	);

	getComments = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { articleId } = req.validated?.params as { articleId: string };
			const query = req.validated?.query as GetArticleCommentsInput;
			const data = await this._getArticleCommentsUseCase.execute({
				articleId,
				page: query.page,
				parentId: query.parentId,
			} as GetArticleCommentsInput);
			return sendSuccess(res, HttpStatus.OK, { data });
		},
	);

	reactToArticle = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { articleId } = req.validated?.params as { articleId: string };
			const body = req.validated?.body as ReactToArticleInput;
			const data = await this._reactToArticleUseCase.execute({
				articleId,
				userId: req.user.id,
				reactionType: body.reactionType,
			} as ReactToArticleInput);
			return sendSuccess(res, HttpStatus.OK, { data });
		},
	);

	reactToComment = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { commentId } = req.validated?.params as { commentId: string };
			const body = req.validated?.body as ReactToArticleCommentInput;
			const data = await this._reactToArticleCommentUseCase.execute({
				commentId,
				userId: req.user.id,
				reactionType: body.reactionType,
			} as ReactToArticleCommentInput);
			return sendSuccess(res, HttpStatus.OK, { data });
		},
	);
}
