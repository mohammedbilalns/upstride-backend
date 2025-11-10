import { Chat } from "../../../domain/entities/chat.entity";
import { IChatRepository } from "../../../domain/repositories/chat.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { chatModel, IChat } from "../models/chat.model";
import { BaseRepository } from "./base.repository";

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
    const skip = (page - 1) * limit;
    const [chats, total] = await Promise.all([
      this._model
      .find({ userIds: userId, isArchived: false, isStarted: true })
      .select("_id userIds")
      .populate({
        path: 'lastMessage',
        select:"content type createdAt",
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
