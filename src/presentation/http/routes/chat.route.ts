import { Router } from "express";
import { container } from "../../../main/container";
import { ROUTES } from "../constants";
import { ChatController } from "../controllers";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	chatIdParamSchema,
	chatMessagesQuerySchema,
	chatQuerySchema,
	otherUserParamSchema,
	sendMessageBodySchema,
} from "../validators";

const router = Router();
const chatController = container.get(ChatController);

router.use(verifySession);
router.use(authorizeRoles(["USER", "MENTOR"]));

router.get(
	ROUTES.CHATS.ROOT,
	validate({ query: chatQuerySchema }),
	chatController.getChats,
);

router.get(
	ROUTES.CHATS.BY_USER,
	validate({ params: otherUserParamSchema, query: chatMessagesQuerySchema }),
	chatController.getChat,
);

router.post(
	ROUTES.CHATS.MESSAGES,
	validate({ params: chatIdParamSchema, body: sendMessageBodySchema }),
	chatController.sendMessage,
);

router.patch(
	ROUTES.CHATS.READ,
	validate({ params: chatIdParamSchema }),
	chatController.markRead,
);

export { router as chatRouter };
