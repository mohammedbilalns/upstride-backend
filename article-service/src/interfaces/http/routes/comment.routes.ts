import { Router } from "express";
import { createCommentController } from "../compositions/comment.composition";


export function createCommentRoutes(){
	const router = Router(); 
	const commentController = createCommentController()
	router.post("/", commentController.createComment)
	router.delete("/:id", commentController.deleteComment)
	router.put("/", commentController.updateComment)
	router.get("/", commentController.fetch)
	return router

}
