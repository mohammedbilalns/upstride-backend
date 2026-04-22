import { inject, injectable } from "inversify";
import { Chat } from "../../../../domain/entities/chat.entity";
import type {
	IChatRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type { IStorageService } from "../../../services/storage.service.interface";
import { UserNotFoundError } from "../../authentication/errors";
import type { CreateChatInput, CreateChatOutput } from "../dtos/chat.dto";
import { ChatNotAllowedError } from "../errors";
import { ChatMapper } from "../mappers/chat.mapper";
import type { ICreateChatUseCase } from "./create-chat.use-case.interface";

@injectable()
export class CreateChatUseCase implements ICreateChatUseCase {
	constructor(
		@inject(TYPES.Repositories.ChatRepository)
		private readonly _chatRepository: IChatRepository,
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute(input: CreateChatInput): Promise<CreateChatOutput> {
		const [user, otherUser] = await Promise.all([
			this._userRepository.findById(input.userId),
			this._userRepository.findById(input.otherUserId),
		]);

		if (!user || !otherUser) {
			throw new UserNotFoundError();
		}

		if (!Chat.canStartBetween(user.role, otherUser.role)) {
			throw new ChatNotAllowedError(
				"Chat is only allowed between a user and a mentor.",
			);
		}

		const usersById = new Map();
		const receiverProfilePictureUrl = otherUser.profilePictureId
			? this._storageService.getPublicUrl(otherUser.profilePictureId)
			: null;

		usersById.set(user.id, {
			id: user.id,
			name: user.name,
		});
		usersById.set(otherUser.id, {
			id: otherUser.id,
			name: otherUser.name,
			profilePictureUrl: receiverProfilePictureUrl,
		});

		const existing = await this._chatRepository.findByParticipants(
			input.userId,
			input.otherUserId,
		);

		if (existing) {
			return {
				chat: ChatMapper.toDtoForUser(existing, input.userId, usersById),
			};
		}

		const unreadCount = new Map<string, number>([
			[input.userId, 0],
			[input.otherUserId, 0],
		]);

		const chat = new Chat(
			this._idGenerator.generate(),
			input.userId,
			input.otherUserId,
			null,
			unreadCount,
			new Date(),
			new Date(),
		);

		const created = await this._chatRepository.create(chat);
		const chatDto = ChatMapper.toDtoForUser(created, input.userId, usersById);

		return { chat: chatDto };
	}
}
