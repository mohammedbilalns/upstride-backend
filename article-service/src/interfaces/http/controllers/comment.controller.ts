import { HttpStatus, ResponseMessage } from "../../../common/enums";
import { ICreateCommentUc } from "../../../domain/useCases/comments/create-comment.usecase.interface";
import { IDeleteCommentUC } from "../../../domain/useCases/comments/delete-comment.usecase.interface";
import { IGetCommentsUC } from "../../../domain/useCases/comments/get-comments.usecase.interface";
import { IUpdateCommentUC } from "../../../domain/useCases/comments/update-comment.usecase.interface";
import asyncHandler from "../utils/async-handler";
import {
	articleCommentSchema,
	articleCommentUpdateSchema,
	deleteCommentSchema,
	fetchCommentsQuerySchema,
} from "../validations/comment.validation";

export class ArticleCommentController {
	constructor(
		private _createCommentUC: ICreateCommentUc,
		private _updateCommentUC: IUpdateCommentUC,
		private _deleteCommentUC: IDeleteCommentUC,
		private _getCommentsUC: IGetCommentsUC,
	) {}

	public createComment = asyncHandler(async (req, res) => {
		const articleCommentDto = articleCommentSchema.parse(req.body);
		const {
			id: userId,
			name: userName,
			profilePicture: userImage,
		} = res.locals.user;
		await this._createCommentUC.execute({
			userId,
			userName,
			userImage,
			...articleCommentDto,
		});
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.COMMENT_CREATED });
	});

	public updateComment = asyncHandler(async (req, res) => {
		const articleCommentUpdateDto = articleCommentUpdateSchema.parse(req.body);
		const userId = res.locals.user.id;
		await this._updateCommentUC.execute({
			userId,
			...articleCommentUpdateDto,
		});
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.COMMENT_UPDATED });
	});

	public deleteComment = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { commentId } = deleteCommentSchema.parse(req.query);
		await this._deleteCommentUC.execute({ commentId, userId });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.COMMENT_DELETED });
	});

	public fetch = asyncHandler(async (req, res) => {
		const { articleId, page, limit, parentCommentId } =
			fetchCommentsQuerySchema.parse(req.query);
		const userId = res.locals.user.id;
		const comments = await this._getCommentsUC.execute({
			articleId,
			userId,
			page,
			limit,
			parentCommentId,
		});
		res.status(HttpStatus.OK).send(comments);
	});
}
