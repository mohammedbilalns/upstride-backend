import { Router } from "express";
import { createReactionController } from "../compositions/reaction.composition";

export function createReactionRoutes() {
	const router = Router();
	const reactionController = createReactionController();
	router.post("/", reactionController.reactArticle);
	router.get("/", reactionController.fetchReactions);

	return router;
}
