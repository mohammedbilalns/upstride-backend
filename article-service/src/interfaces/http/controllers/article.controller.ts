import { HttpStatus, ResponseMessage } from "../../../common/enums";
import type {
	IArticleReadService,
	IArticleWriteService,
} from "../../../domain/services";
import asyncHandler from "../utils/asyncHandler";
import {
	createArticleSchema,
	deleteArticleParamsSchema,
	fetchArticleParamsSchema,
	fetchArticlesSchema,
	fetchRandomArticlesByAuthorsSchema,
	updateArticleSchema,
} from "../validations/article.validation";

export class ArticleController {
	constructor(
		private _articleReadService: IArticleReadService,
		private _articleWriteService: IArticleWriteService,
	) {}

	public create = asyncHandler(async (req, res) => {
		const articleData = createArticleSchema.parse(req.body);
		const { id: author, name: authorName, role: authorRole } = res.locals.user;
		await this._articleWriteService.createArticle({
			author,
			authorName,
			authorRole,
			...articleData,
		});
		res
			.status(HttpStatus.CREATED)
			.send({ success: true, message: ResponseMessage.ARTICLE_CREATED });
	});

	public update = asyncHandler(async (req, res) => {
		const articleData = updateArticleSchema.parse(req.body);
		const userId = res.locals.user.id;
		await this._articleWriteService.updateArticle({ userId, ...articleData });
		res
			.status(HttpStatus.CREATED)
			.send({ success: true, message: ResponseMessage.ARTICLE_CREATED });
	});

	public delete = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { articleId } = deleteArticleParamsSchema.parse(req.params);
		await this._articleWriteService.deleteArticle(articleId, userId);
		res
			.status(HttpStatus.OK)
			.send({ success: true, message: ResponseMessage.ARTICLE_DELETED });
	});

	public fetchArticle = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { articleId } = fetchArticleParamsSchema.parse(req.params);

		const { article, isViewed, isLiked } =
			await this._articleReadService.getArticleById(articleId, userId);

		res.status(HttpStatus.OK).json({ article, isViewed, isLiked });
	});

	public fetchArticles = asyncHandler(async (req, res) => {
		const fetchArticleParams = fetchArticlesSchema.parse(req.query);
		const articles =
			await this._articleReadService.fetchArticles(fetchArticleParams);
		res.status(HttpStatus.OK).send(articles);
	});

	public fetchRandomArticlesByAuthors = asyncHandler(async (req, res) => {
		const fetchArticlesParams = fetchRandomArticlesByAuthorsSchema.parse(
			req.query,
		);
		const articles =
			await this._articleReadService.getRandomArticlesByAuthors(
				fetchArticlesParams,
			);
		res.status(HttpStatus.OK).send(articles);
	});
}
