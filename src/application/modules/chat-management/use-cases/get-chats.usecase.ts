import { inject, injectable } from "inversify";
import type { UserRole } from "../../../../domain/entities/user.entity";
import type { IChatRepository } from "../../../../domain/repositories/chat.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { IStorageService } from "../../../services/storage.service.interface";
import { mapPaginatedResult } from "../../../shared/utilities/pagination.util";
import type { GetChatsInput, GetChatsOutput } from "../dtos/chat.dto";
import { ChatMapper } from "../mappers/chat.mapper";
import type { IGetChatsUseCase } from "./get-chats.usecase.interface";

const CHAT_PAGE_SIZE = 10;

@injectable()
export class GetChatsUseCase implements IGetChatsUseCase {
	constructor(
		@inject(TYPES.Repositories.ChatRepository)
		private readonly _chatRepository: IChatRepository,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute(input: GetChatsInput): Promise<GetChatsOutput> {
		const result = await this._chatRepository.paginateByUserWithUsers(
			input.userId,
			input.filter ?? "all",
			input.page ?? 1,
			CHAT_PAGE_SIZE,
		);

		const usersById = new Map<
			string,
			{
				id: string;
				name: string;
				profilePictureUrl: string | null;
				role?: UserRole;
			}
		>();
		const usersByIdRaw = new Map(result.users.map((user) => [user.id, user]));

		const senderUser = usersByIdRaw.get(input.userId);
		if (senderUser) {
			usersById.set(senderUser.id, {
				id: senderUser.id,
				name: senderUser.name,
				profilePictureUrl: null,
				role: senderUser.role ?? "USER",
			});
		}

		const receiverUrlCache = new Map<string, string | null>();
		await Promise.all(
			result.items.map(async (chat) => {
				const receiverId =
					chat.user1Id === input.userId ? chat.user2Id : chat.user1Id;
				if (usersById.has(receiverId)) return;
				const receiverUser = usersByIdRaw.get(receiverId);
				if (!receiverUser) return;
				if (receiverUrlCache.has(receiverId)) {
					usersById.set(receiverUser.id, {
						id: receiverUser.id,
						name: receiverUser.name,
						profilePictureUrl: receiverUrlCache.get(receiverId) ?? null,
						role: receiverUser.role ?? "USER",
					});
					return;
				}
				const profilePictureUrl = receiverUser.profilePictureId
					? this._storageService.getPublicUrl(receiverUser.profilePictureId)
					: null;
				receiverUrlCache.set(receiverId, profilePictureUrl);
				usersById.set(receiverUser.id, {
					id: receiverUser.id,
					name: receiverUser.name,
					profilePictureUrl,
					role: receiverUser.role ?? "USER",
				});
			}),
		);

		const { items, ...meta } = mapPaginatedResult(result, (items) =>
			ChatMapper.toDtosForUser(
				items,
				input.userId,
				usersById,
				result.lastMessages,
			),
		);
		return { ...meta, chats: items };
	}
}
