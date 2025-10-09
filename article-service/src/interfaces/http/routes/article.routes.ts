import { Router } from "express";
import { createArticleController } from "../compositions/article.composition";
import { authMiddleware } from "../middlewares";

export function createArticleRoutes() {
	const router = Router();
	const articleController = createArticleController();

	router.use(authMiddleware());

	router.get("/:id", articleController.fetchArticle);
	router.get("/", articleController.fetchArticles);
	router.post("/", articleController.create);
	router.put("/", articleController.update);
	router.delete("/:id", articleController.delete);
	return router;
}
