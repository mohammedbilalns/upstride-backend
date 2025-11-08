import { Router } from "express";
import { createChatController } from "../compositions/chat.composition";
import { authMiddleware } from "../middlewares";

export function createChatRoutes() {
	const router = Router();
	const chatController = createChatController();

	router.use(authMiddleware());

	router.get("/", chatController.getChats);
	router.get("/:chatId", chatController.getChat);

	return router;
}
