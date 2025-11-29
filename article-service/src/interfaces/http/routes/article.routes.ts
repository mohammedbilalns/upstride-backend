import { Router } from "express";
import { createArticleController } from "../compositions/article.composition";
import { authMiddleware } from "../middlewares";

export function createArticleRoutes() {
	const router = Router();
	const articleController = createArticleController();

	router.get("/by-users", articleController.fetchRandomArticlesByAuthors);
	router.use(authMiddleware());

	router.get("/:articleId", articleController.fetchArticle);
	router.get("/", articleController.fetchArticles);
	router.post("/", articleController.create);
	router.put("/", articleController.update);
	router.delete("/:articleId", articleController.delete);
	return router;
}
