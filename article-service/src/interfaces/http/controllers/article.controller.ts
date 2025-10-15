import { HttpStatus, ResponseMessage } from "../../../common/enums";
import type {
	IArticleReadService,
	IArticleWriteService,
} from "../../../domain/services";
import asyncHandler from "../utils/asyncHandler";
import {
	createArticleSchema,
	fetchArticlesSchema,
	fetchRandomArticlesByAuthorsSchema,
	updateArticleSchema,
} from "../validations/article.validation";

export class ArticleController {
	constructor(
		private _articleReadService: IArticleReadService,
		private _articleWriteService: IArticleWriteService,
	) {}

	create = asyncHandler(async (req, res) => {
		const articleData = createArticleSchema.parse(req.body);
		const {id:author , name: authorName ,role: authorRole  , autherImage: authorImage} = res.locals.user;
		await this._articleWriteService.createArticle({
			author,
			authorName,
			authorRole,
			authorImage,
			...articleData,
		});
		res
			.status(HttpStatus.CREATED)
			.send({ success: true,  message: ResponseMessage.ARTICLE_CREATED });
	});

	update = asyncHandler(async (req, res) => {
		const articleData = updateArticleSchema.parse(req.body);
		const userId = res.locals.user.id;
		await this._articleWriteService.updateArticle({ userId, ...articleData });
		res
			.status(HttpStatus.CREATED)
			.send({ success: true,  message: ResponseMessage.ARTICLE_CREATED });
	});

	delete = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const id = req.params.id;
		await this._articleWriteService.deleteArticle(id, userId);
		res
			.status(HttpStatus.OK)
			.send({ success: true,  message: ResponseMessage.ARTICLE_DELETED });
	});

	fetchArticle = asyncHandler(async (req, res) => {
		const id = req.params.id;
		const userId = res.locals.user.id;
		const { article, isViewed, isLiked } =
			await this._articleReadService.getArticleById(id, userId);
		res.status(HttpStatus.OK).json({ article, isViewed, isLiked });
	});

	fetchArticles = asyncHandler(async (req, res) => {
		const fetchArticleParams = fetchArticlesSchema.parse(req.query);
		const articles =
			await this._articleReadService.fetchArticles(fetchArticleParams);
		res.status(HttpStatus.OK).send(articles);
	});

	fetchRandomArticlesByAuthors = asyncHandler(async (req, res) => {
		console.log("query in article service", req.query);
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
