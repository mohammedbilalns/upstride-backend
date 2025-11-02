import { IGetChatUC } from "../../../domain/useCases/getChat.uc.interface";
import { IGetChatsUC } from "../../../domain/useCases/getChats.uc.interface";
import asyncHandler from "../utils/asyncHandler";
import { getChatSchema } from "../validations/getChat.schema";
import { getChatsSchema } from "../validations/getChats.schema";

export class ChatController {
	constructor(
		private _getChatsUC: IGetChatsUC,
		private _getChatUC: IGetChatUC,
	) {}

	getChats = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { page, limit } = getChatSchema.parse(req.query);
		const data = await this._getChatsUC.execute({ userId, page, limit });
		res.send(data);
	});

	getChat = asyncHandler(async (req, res) => {
		const { userIds, page, limit } = getChatsSchema.parse(req.query);

		const data = await this._getChatUC.execute({ userIds, page, limit });
		res.send(data);
	});
}
