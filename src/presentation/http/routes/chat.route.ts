import { Router } from "express";
import { apiContainer } from "../../../main/api.container";
import { ROUTES } from "../constants";
import { ChatController } from "../controllers";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	ChatIdParamSchema,
	ChatQuerySchema,
	GetChatParamsSchema,
	GetChatQuerySchema,
	SendMessageBodySchema,
} from "../validators";

const router = Router();
const chatController = apiContainer.get(ChatController);

router.use(verifySession);
router.use(authorizeRoles(["USER", "MENTOR"]));

router.get(
	ROUTES.CHATS.ROOT,
	validate({ query: ChatQuerySchema }),
	chatController.getChats,
);

router.get(
	ROUTES.CHATS.BY_USER,
	validate({ params: GetChatParamsSchema, query: GetChatQuerySchema }),
	chatController.getChat,
);

router.post(
	ROUTES.CHATS.MESSAGES,
	validate({ params: ChatIdParamSchema, body: SendMessageBodySchema }),
	chatController.sendMessage,
);

router.patch(
	ROUTES.CHATS.READ,
	validate({ params: ChatIdParamSchema }),
	chatController.markRead,
);

export { router as chatRouter };
