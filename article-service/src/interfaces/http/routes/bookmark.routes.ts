import { Router } from "express";
import { createBookmarkController } from "../compositions/bookmark.composition";

export function createBookmarkRoutes() {
	const router = Router();
	const bookmarkController = createBookmarkController();

	router.get("/", bookmarkController.fetchBookMarks);
	router.post("/", bookmarkController.createBookMark);
	router.delete("/bookmarks/:userId/:articleId", bookmarkController.deleteBookMark);
	return router;
}



