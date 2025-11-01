import { HttpStatus, ResponseMessage } from "../../../common/enums";
import type { IArticleCommentService } from "../../../domain/services";
import asyncHandler from "../utils/asyncHandler";
import {
	articleCommentSchema,
	articleCommentUpdateSchema,
	deleteCommentSchema,
	fetchCommentsQuerySchema,
} from "../validations/comment.validation";

export class ArticleCommentController {
	constructor(private _articleCommentService: IArticleCommentService) {}

	createComment = asyncHandler(async (req, res) => {
		const articleCommentDto = articleCommentSchema.parse(req.body);
		const {
			id: userId,
			name: userName,
			profilePicture: userImage,
		} = res.locals.user;
		await this._articleCommentService.createComment({
			userId,
			userName,
			userImage,
			...articleCommentDto,
		});
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.COMMENT_CREATED });
	});

	updateComment = asyncHandler(async (req, res) => {
		const articleCommentUpdateDto = articleCommentUpdateSchema.parse(req.body);
		const userId = res.locals.user.id;
		await this._articleCommentService.updateComment({
			userId,
			...articleCommentUpdateDto,
		});
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.COMMENT_UPDATED });
	});

	deleteComment = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { commentId } = deleteCommentSchema.parse(req.query);
		await this._articleCommentService.deleteComment(commentId, userId);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.COMMENT_DELETED });
	});

	fetch = asyncHandler(async (req, res) => {
		const { articleId, page, limit, parentCommentId } =
			fetchCommentsQuerySchema.parse(req.query);
		const userId = res.locals.user.id;
		const comments = await this._articleCommentService.getComments({
			articleId,
			userId,
			page,
			limit,
			parentCommentId,
		});
		res.status(HttpStatus.OK).send(comments);
	});
}
