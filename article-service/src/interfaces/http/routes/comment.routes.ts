import { Router } from "express";
import { createCommentController } from "../compositions/comment.composition";
import { authMiddleware } from "../middlewares";

export function createCommentRoutes() {
	const router = Router();
	const commentController = createCommentController();

	router.use(authMiddleware());
	router.post("/", commentController.createComment);
	router.delete("/:id", commentController.deleteComment);
	router.put("/", commentController.updateComment);
	router.get("/", commentController.fetch);
	return router;
}
