import { ErrorMessage } from "../../common/enums";
import type { IChatRepository } from "../../domain/repositories";
import type { IUserService } from "../../domain/services/user.service.interface";
import type { IGetChatsUC } from "../../domain/useCases/getChats.uc.interface";
import type { GetChatsDto, GetChatsResult } from "../dtos/getChats.dto";
import { AppError } from "../errors/AppError";

export class GetChatsUC implements IGetChatsUC {
	constructor(
		private _chatRepository: IChatRepository,
		private _userService: IUserService,
	) {}

	async execute(dto: GetChatsDto): Promise<GetChatsResult> {
		const { userId, page, limit } = dto;

		// Fetch chats of the user
		const { chats, total } = await this._chatRepository.getUserChats(
			userId,
			page,
			limit,
		);

		if (!chats.length) return { chats: [], total };

		// Extract the other participant IDs
		const otherUserIds = chats
			.map((chat) => chat.userIds.find((id) => id !== userId))
			.filter(Boolean) as string[];
		// Fetch user data
		const users = await this._userService.getUsersByIds(otherUserIds);
		if (!users) throw new AppError(ErrorMessage.FAILED_TO_FETCH_USERS);
		const userMap = new Map(users.map((u) => [u.id, u]));

		// Attach user data to each chat
		const mappedChats = chats.map((chat) => {
			const unread = Object.fromEntries(chat.unreadCount);

			const otherUserId = chat.userIds.find((id) => id !== userId);
			return {
				...chat,
				participant: otherUserId
					? userMap.get(otherUserId)
						? {
								...userMap.get(otherUserId)!,
								isMentor: userMap.get(otherUserId)!.role === "mentor",
								mentorId: userMap.get(otherUserId)!.mentorId,
							}
						: null
					: null,
				unreadCount: unread[userId] ?? 0,
			};
		});

		return { chats: mappedChats, total };
	}
}
