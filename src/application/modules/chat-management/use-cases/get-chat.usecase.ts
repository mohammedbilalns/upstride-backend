import { inject, injectable } from "inversify";
import { Chat } from "../../../../domain/entities/chat.entity";
import type {
	IChatMessageRepository,
	IChatRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IStorageService } from "../../../services/storage.service.interface";
import type { GetChatInput, GetChatOutput } from "../dtos/chat.dto";
import { ChatMapper } from "../mappers/chat.mapper";
import { ChatMessageMapper } from "../mappers/chat-message.mapper";
import type { IGetChatUseCase } from "./get-chat.usecase.interface";

const CHAT_MESSAGES_PAGE_SIZE = 10;

@injectable()
export class GetChatUseCase implements IGetChatUseCase {
	constructor(
		@inject(TYPES.Repositories.ChatRepository)
		private readonly _chatRepository: IChatRepository,
		@inject(TYPES.Repositories.ChatMessageRepository)
		private readonly _chatMessageRepository: IChatMessageRepository,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute(input: GetChatInput): Promise<GetChatOutput> {
		const { chat: existing, users } =
			await this._chatRepository.findByParticipantsWithUsers(
				input.userId,
				input.otherUserId,
			);

		const usersByIdRaw = new Map(users.map((user) => [user.id, user]));
		const usersById = new Map<
			string,
			{ id: string; name: string; profilePictureUrl: string | null }
		>();

		const senderUser = usersByIdRaw.get(input.userId);
		if (senderUser) {
			usersById.set(senderUser.id, {
				id: senderUser.id,
				name: senderUser.name,
				profilePictureUrl: null,
			});
		}

		const receiverUser = usersByIdRaw.get(input.otherUserId);
		if (receiverUser) {
			const profilePictureUrl = receiverUser.profilePictureId
				? await this._storageService.getSignedUrl(receiverUser.profilePictureId)
				: null;
			usersById.set(receiverUser.id, {
				id: receiverUser.id,
				name: receiverUser.name,
				profilePictureUrl,
			});
		}

		if (!existing) {
			return {
				chat: null,
				messages: [],
				total: 0,
				page: 1,
				limit: CHAT_MESSAGES_PAGE_SIZE,
				totalPages: 0,
			};
		}

		const result = await this._chatMessageRepository.paginate({
			page: input.page ?? 1,
			limit: CHAT_MESSAGES_PAGE_SIZE,
			query: { chatId: existing.id },
			sort: { createdAt: -1 },
		});

		const updatedCount = await this._chatMessageRepository.markAsRead(
			existing.id,
			input.userId,
		);

		const unreadCount = new Map(existing.unreadCount);
		unreadCount.set(input.userId, 0);
		await this._chatRepository.updateById(existing.id, { unreadCount });

		const chatForResponse =
			updatedCount > 0 || unreadCount.get(input.userId) === 0
				? new Chat(
						existing.id,
						existing.user1Id,
						existing.user2Id,
						existing.lastMessageId,
						unreadCount,
						existing.createdAt,
						existing.updatedAt,
					)
				: existing;

		const mediaUrls = new Map<string, string>();
		await Promise.all(
			result.items.map(async (item) => {
				if (!item.attachementId) return;
				if (mediaUrls.has(item.attachementId)) return;
				const url = await this._storageService.getSignedUrl(item.attachementId);
				mediaUrls.set(item.attachementId, url);
			}),
		);

		return {
			chat: ChatMapper.toDtoForUser(chatForResponse, input.userId, usersById),
			messages: result.items.map((item) =>
				ChatMessageMapper.toDto(
					item,
					item.attachementId
						? (mediaUrls.get(item.attachementId) ?? null)
						: null,
				),
			),
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}
