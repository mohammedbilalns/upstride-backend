import { HttpStatus, ResponseMessage } from "../../../common/enums";
import type { IBookMarkService } from "../../../domain/services/bookmark.service.interface";
import asyncHandler from "../utils/async-handler";
import {
	createBookMarkSchema,
	fetchBookMarksParamsSchema,
} from "../validations/bookmark.validation";

export class BookMarkController {
	constructor(private _bookMarkService: IBookMarkService) {}

	public fetchBookMarks = asyncHandler(async (req, res) => {
		const { id: userId } = res.locals.user;
		const { page, limit, query } = fetchBookMarksParamsSchema.parse(req.query);
		const bookmarks = await this._bookMarkService.fetchBookMarkedArticles(
			userId,
			page,
			limit,
			query,
		);
		res.status(HttpStatus.OK).json(bookmarks);
	});

	public createBookMark = asyncHandler(async (req, res) => {
		const { id: userId } = res.locals.user;
		const { articleId } = createBookMarkSchema.parse(req.body);
		await this._bookMarkService.saveArticle(userId, articleId);
		res
			.status(HttpStatus.OK)
			.json({ succes: true, message: ResponseMessage.BOOKMARK_CREATED });
	});

	public deleteBookMark = asyncHandler(async (req, res) => {
		const { userId, articleId } = req.params;
		await this._bookMarkService.deleteBookMark(userId, articleId);
		res
			.status(HttpStatus.OK)
			.json({ message: ResponseMessage.BOOKMARK_DELETED });
	});
}
