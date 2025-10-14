import { HttpStatus, ResponseMessage } from "../../../common/enums";
import { IBookMarkService } from "../../../domain/services/bookmark.service.interface";
import asyncHandler from "../utils/asyncHandler";
import { createBookMarkSchema, fetchBookMarksParamsSchema } from "../validations/bookmark.validation";

export class BookMarkController {
	constructor(
		private _bookMarkService : IBookMarkService, 
	){}

	fetchBookMarks = asyncHandler(async (req, res,) => {
		const { id: userId } = res.locals.user; 
		const { page, limit,query } = fetchBookMarksParamsSchema.parse(req.query);
		const bookmarks = await this._bookMarkService.fetchBookMarkedArticles(userId, page, limit,query );
		res.status(HttpStatus.OK).json(bookmarks);
	});

	createBookMark = asyncHandler(async (req, res,) => {
		const {id: userId} = res.locals.user;
		const { articleId } = createBookMarkSchema.parse(req.body) 
		await this._bookMarkService.saveArticle(userId, articleId);
		res.status(HttpStatus.OK).json({succes: true ,   message: ResponseMessage.BOOKMARK_CREATED });
	});

	deleteBookMark = asyncHandler(async (req, res,) => {
		const { userId, articleId } = req.params;
		await this._bookMarkService.deleteBookMark(userId, articleId);
		res.status(200).json({ message: ResponseMessage.BOOKMARK_DELETED });
	});
}
