import { Router } from "express";
import { createTagController } from "../compositions/tag.composition";

export function createTagRoutes() {
	const router = Router();
	const tagController = createTagController();

	router.get("/most-used", tagController.fetchMostUsedTags);
	return router;
}
