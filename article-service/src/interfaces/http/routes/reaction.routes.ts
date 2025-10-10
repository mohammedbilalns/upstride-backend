import { Router } from "express";
import { createReactionController } from "../compositions/reaction.composition";
import { authMiddleware, rateLimiter } from "../middlewares";

export function createReactionRoutes() {
	const router = Router();
	const reactionController = createReactionController();


	router.use(authMiddleware()) 
	router.post("/",rateLimiter(10,60,["ip","route"]), reactionController.reactArticle)
	router.get("/", reactionController.fetchReactions);

	return router;
}
