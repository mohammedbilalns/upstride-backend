import { HttpStatus, ResponseMessage } from "../../../common/enums";
import { IArticleService } from "../../../domain/services";
import asyncHandler from "../utils/asyncHandler";
import {
  createArticleSchema,
  fetchArticlesSchema,
  updateArticleSchema,
} from "../validations/article.validation";

export class ArticleController {
  constructor(private _articleService: IArticleService) {}

  create = asyncHandler(async (req, res) => {
    const articleData = createArticleSchema.parse(req.body);
    const author = res.locals.user.id;
    const authorName = res.locals.user.name;
    const authorImage = res.locals.user.profilePicture;

    await this._articleService.createArticle({
      author,
      authorName,
      authorImage,
      ...articleData,
    });
    res
      .status(HttpStatus.CREATED)
      .send({ message: ResponseMessage.ARTICLE_CREATED });
  });

update = asyncHandler(async (req, res) => {
    const articleData = updateArticleSchema.parse(req.body);
    const userId = res.locals.user.id;
    await this._articleService.updateArticle({ userId, ...articleData });
    res
      .status(HttpStatus.CREATED)
      .send({ message: ResponseMessage.ARTICLE_CREATED });
  });

  delete = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await this._articleService.deleteArticle(id);
    res
      .status(HttpStatus.OK)
      .send({ message: ResponseMessage.ARTICLE_DELETED });
  });

	fetchArticle = asyncHandler(async (req, res) => {
		const id = req.params.id;
		const userId = res.locals.user.id;
		const {article, isViewed, isLiked} = await this._articleService.getArticleById(id, userId);
		res.status(HttpStatus.OK).json({article, isViewed, isLiked});
	});

	fetchArticles = asyncHandler(async (req, res) => {
		const fetchArticleParams = fetchArticlesSchema.parse(req.query);
		const articles = await this._articleService.fetchArticles(fetchArticleParams);
		res.status(HttpStatus.OK).send(articles);
	});

}

