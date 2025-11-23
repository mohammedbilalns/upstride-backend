import type { Chat } from "../../../domain/entities/chat.entity";
import type { IChatRepository } from "../../../domain/repositories/chat.repository.interface";
import mongoose from "mongoose";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { chatModel, type IChat } from "../models/chat.model";
import { BaseRepository } from "./base.repository";
import { AppError } from "../../../application/errors/AppError";
import { ErrorMessage, HttpStatus } from "../../../common/enums";

export class ChatRepository
	extends BaseRepository<Chat, IChat>
	implements IChatRepository
{
	constructor() {
		super(chatModel);
	}

	protected mapToDomain(doc: IChat): Chat {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			userIds: mapped.userIds,
			lastMessage: mapped.lastMessage,
			isArchived: mapped.isArchived,
			unreadCount: mapped.unreadCount,
			createdAt: mapped.createdAt,
			updatedAt: mapped.updatedAt,
		};
	}

	async getChatByUserIds(userIds: string[]): Promise<Chat | null> {
		const chat = await this._model.findOne({ userIds: { $all: userIds } });
		return chat ? this.mapToDomain(chat) : null;
	}

	async getUserChats(
		userId: string,
		page: number,
		limit: number,
	): Promise<{ chats: Chat[]; total: number }> {
		if (!mongoose.isValidObjectId(userId)) {
			throw new AppError(ErrorMessage.CHAT_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		const skip = (page - 1) * limit;
		const [chats, total] = await Promise.all([
			this._model
				.find({ userIds: userId, isArchived: false, isStarted: true })
				.select("_id userIds unreadCount")
				.populate({
					path: "lastMessage",
					select: "content type createdAt senderId type status",
				})
				.skip(skip)
				.limit(limit),
			this._model.countDocuments({
				userIds: userId,
				isArchived: false,
				isStarted: true,
			}),
		]);

		return { chats: chats ? chats.map(this.mapToDomain) : [], total };
	}
}
