import type { Response } from "express";
import { inject, injectable } from "inversify";
import type {
	IGetChatsUseCase,
	IGetChatUseCase,
	IMarkMessagesReadUseCase,
	ISendMessageUseCase,
} from "../../../application/modules/chat-management/use-cases";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class ChatController {
	constructor(
		@inject(TYPES.UseCases.GetChats)
		private readonly _getChatsUseCase: IGetChatsUseCase,
		@inject(TYPES.UseCases.GetChat)
		private readonly _getChatUseCase: IGetChatUseCase,
		@inject(TYPES.UseCases.SendChatMessage)
		private readonly _sendMessageUseCase: ISendMessageUseCase,
		@inject(TYPES.UseCases.MarkChatMessagesRead)
		private readonly _markMessagesReadUseCase: IMarkMessagesReadUseCase,
	) {}

	getChats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
		const query = (req.validated?.query ?? {}) as Record<string, unknown>;
		const result = await this._getChatsUseCase.execute({
			userId: req.user.id,
			...query,
		});

		return sendSuccess(res, HttpStatus.OK, { data: result });
	});

	getChat = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
		const { otherUserId } = req.validated?.params as { otherUserId: string };
		const query = (req.validated?.query ?? {}) as Record<string, unknown>;
		const result = await this._getChatUseCase.execute({
			userId: req.user.id,
			otherUserId,
			...query,
		});

		return sendSuccess(res, HttpStatus.OK, { data: result });
	});

	sendMessage = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { chatId } = req.validated?.params as { chatId: string };
			const body = (req.validated?.body ?? {}) as Record<string, unknown>;

			const result = await this._sendMessageUseCase.execute({
				chatId,
				senderId: req.user.id,
				content: (body.content as string | undefined) ?? null,
				mediaId: (body.mediaId as string | undefined) ?? null,
				repliedTo: (body.repliedTo as string | undefined) ?? null,
			});

			return sendSuccess(res, HttpStatus.CREATED, { data: result });
		},
	);

	markRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
		const { chatId } = req.validated?.params as { chatId: string };
		const result = await this._markMessagesReadUseCase.execute({
			chatId,
			readerId: req.user.id,
		});

		return sendSuccess(res, HttpStatus.OK, { data: result });
	});
}
