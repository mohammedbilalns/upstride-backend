import { Router } from "express";
import { createChatController } from "../compositions/chat.composition";

export function createChatRoutes() {
	const router = Router();
	const chatController = createChatController();

	router.get("/", chatController.getChats);
	router.get("/single", chatController.getChat);

	return router;
}
