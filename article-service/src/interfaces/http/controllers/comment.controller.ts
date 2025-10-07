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
		const { userId, userName, userImage } = res.locals.user;
		await this._articleCommentService.createComment({
			userId,
			userName,
			userImage,
			...articleCommentDto,
		});
		res.status(HttpStatus.OK).send(ResponseMessage.COMMENT_CREATED);
	});

	updateComment = asyncHandler(async (req, res) => {
		const articleCommentUpdateDto = articleCommentUpdateSchema.parse(req.body);
		const userId = res.locals.user.id;
		await this._articleCommentService.updateComment({
			userId,
			...articleCommentUpdateDto,
		});
		res.status(HttpStatus.OK).send(ResponseMessage.COMMENT_UPDATED);
	});

	deleteComment = asyncHandler(async (req, res) => {
		const { id } = deleteCommentSchema.parse(req.params);
		await this._articleCommentService.deleteComment(id);
		res.status(HttpStatus.OK).send(ResponseMessage.COMMENT_DELETED);
	});

	fetch = asyncHandler(async (req, res) => {
		const fetchCommentsDto = fetchCommentsQuerySchema.parse(req.query);
		const comments =
			await this._articleCommentService.getComments(fetchCommentsDto);
		res.status(HttpStatus.OK).send(comments);
	});
}
