import { Router } from "express";
import { container } from "../../../main/container";
import { ROUTES } from "../constants";
import { ArticleController } from "../controllers/article.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	AppealArticleBodySchema,
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
const controller = container.get(ArticleController);

router.use(verifySession);

router.get(
	ROUTES.ARTICLES.TOP_TAGS,
	authorizeRoles(["USER", "MENTOR", "ADMIN", "SUPER_ADMIN"]),
	controller.getTopTags,
);

router.get(
	ROUTES.ARTICLES.ROOT,
	authorizeRoles(["USER", "MENTOR", "ADMIN", "SUPER_ADMIN"]),
	validate({ query: ArticlesQuerySchema }),
	controller.getArticles,
);

router.get(
	ROUTES.ARTICLES.MENTOR,
	authorizeRoles(["MENTOR"]),
	validate({ query: MentorArticlesQuerySchema }),
	controller.getMentorArticles,
);

router.get(
	ROUTES.ARTICLES.BY_SLUG,
	authorizeRoles(["USER", "MENTOR", "ADMIN", "SUPER_ADMIN"]),
	validate({ params: ArticleSlugParamSchema }),
	controller.getArticle,
);

router.post(
	ROUTES.ARTICLES.ROOT,
	authorizeRoles(["MENTOR"]),
	validate({ body: CreateArticleBodySchema }),
	controller.createArticle,
);

router.patch(
	ROUTES.ARTICLES.BY_ID,
	authorizeRoles(["MENTOR"]),
	validate({ params: ArticleIdParamSchema, body: UpdateArticleBodySchema }),
	controller.updateArticle,
);

router.delete(
	ROUTES.ARTICLES.BY_ID,
	authorizeRoles(["MENTOR"]),
	validate({ params: ArticleIdParamSchema }),
	controller.deleteArticle,
);

router.get(
	ROUTES.ARTICLES.COMMENTS,
	authorizeRoles(["USER", "MENTOR", "ADMIN", "SUPER_ADMIN"]),
	validate({ params: ArticleIdParamSchema, query: CommentsQuerySchema }),
	controller.getComments,
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
	controller.updateComment,
);

router.delete(
	ROUTES.ARTICLES.COMMENT_BY_ID,
	authorizeRoles(["USER", "MENTOR"]),
	validate({ params: CommentIdParamSchema }),
	controller.deleteComment,
);

router.post(
	ROUTES.ARTICLES.ARTICLE_REACTIONS,
	authorizeRoles(["USER", "MENTOR"]),
	validate({ params: ArticleIdParamSchema, body: ReactBodySchema }),
	controller.reactToArticle,
);

router.post(
	ROUTES.ARTICLES.COMMENT_REACTIONS,
	authorizeRoles(["USER", "MENTOR"]),
	validate({ params: CommentIdParamSchema, body: ReactBodySchema }),
	controller.reactToComment,
);

router.post(
	ROUTES.ARTICLES.APPEAL(":articleId"),
	authorizeRoles(["MENTOR"]),
	validate({ params: ArticleIdParamSchema, body: AppealArticleBodySchema }),
	controller.submitAppeal,
);

export { router as articleRouter };
