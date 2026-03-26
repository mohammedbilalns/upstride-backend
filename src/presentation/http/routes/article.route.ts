import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { ArticleController } from "../controllers/article.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	ArticleIdParamSchema,
	ArticleSlugParamSchema,
	ArticlesQuerySchema,
	CommentIdParamSchema,
	CommentsQuerySchema,
	CreateArticleBodySchema,
	CreateCommentBodySchema,
	MentorArticlesQuerySchema,
	ReactBodySchema,
	UpdateArticleBodySchema,
	UpdateCommentBodySchema,
} from "../validators";

const router = Router();
const controller = container.get<ArticleController>(TYPES.Controllers.Article);

router.use(verifySession);

router.get(
	ROUTES.ARTICLES.TOP_TAGS,
	authorizeRoles(["USER", "MENTOR", "ADMIN", "SUPER_ADMIN"]),
	controller.getTopTags.bind(controller),
);

router.get(
	ROUTES.ARTICLES.ROOT,
	authorizeRoles(["USER", "MENTOR", "ADMIN", "SUPER_ADMIN"]),
	validate({ query: ArticlesQuerySchema }),
	controller.getArticles.bind(controller),
);

router.get(
	ROUTES.ARTICLES.MENTOR,
	authorizeRoles(["MENTOR"]),
	validate({ query: MentorArticlesQuerySchema }),
	controller.getMentorArticles.bind(controller),
);

router.get(
	ROUTES.ARTICLES.BY_SLUG,
	authorizeRoles(["USER", "MENTOR", "ADMIN", "SUPER_ADMIN"]),
	validate({ params: ArticleSlugParamSchema }),
	controller.getArticle.bind(controller),
);

router.post(
	ROUTES.ARTICLES.ROOT,
	authorizeRoles(["MENTOR"]),
	validate({ body: CreateArticleBodySchema }),
	controller.createArticle.bind(controller),
);

router.patch(
	ROUTES.ARTICLES.BY_ID,
	authorizeRoles(["MENTOR"]),
	validate({ params: ArticleIdParamSchema, body: UpdateArticleBodySchema }),
	controller.updateArticle.bind(controller),
);

router.delete(
	ROUTES.ARTICLES.BY_ID,
	authorizeRoles(["MENTOR"]),
	validate({ params: ArticleIdParamSchema }),
	controller.deleteArticle.bind(controller),
);

router.get(
	ROUTES.ARTICLES.COMMENTS,
	authorizeRoles(["USER", "MENTOR", "ADMIN", "SUPER_ADMIN"]),
	validate({ params: ArticleIdParamSchema, query: CommentsQuerySchema }),
	controller.getComments.bind(controller),
);

router.post(
	ROUTES.ARTICLES.COMMENTS,
	authorizeRoles(["USER", "MENTOR"]),
	validate({ params: ArticleIdParamSchema, body: CreateCommentBodySchema }),
	controller.createComment.bind(controller),
);

router.patch(
	ROUTES.ARTICLES.COMMENT_BY_ID,
	authorizeRoles(["USER", "MENTOR"]),
	validate({ params: CommentIdParamSchema, body: UpdateCommentBodySchema }),
	controller.updateComment.bind(controller),
);

router.delete(
	ROUTES.ARTICLES.COMMENT_BY_ID,
	authorizeRoles(["USER", "MENTOR"]),
	validate({ params: CommentIdParamSchema }),
	controller.deleteComment.bind(controller),
);

router.post(
	ROUTES.ARTICLES.ARTICLE_REACTIONS,
	authorizeRoles(["USER", "MENTOR"]),
	validate({ params: ArticleIdParamSchema, body: ReactBodySchema }),
	controller.reactToArticle.bind(controller),
);

router.post(
	ROUTES.ARTICLES.COMMENT_REACTIONS,
	authorizeRoles(["USER", "MENTOR"]),
	validate({ params: CommentIdParamSchema, body: ReactBodySchema }),
	controller.reactToComment.bind(controller),
);

export { router as articleRouter };
