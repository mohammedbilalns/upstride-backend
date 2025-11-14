import { Message } from "../../../domain/entities/message.entity";
import { IMessageRepository } from "../../../domain/repositories/message.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { MessageModel, IMessage } from "../models/message.model";
import { BaseRepository } from "./base.repository";

export class MessageRepository
	extends BaseRepository<Message, IMessage>
	implements IMessageRepository
{
	constructor() {
		super(MessageModel);
	}

	protected mapToDomain(doc: IMessage): Message {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			chatId: mapped.chatId,
			senderId: mapped.senderId,
			content: mapped.content,
			type: mapped.type,
			attachment: mapped.attachment,
			repliedTo: mapped.repliedTo,
			status: mapped.status,
			createdAt: mapped.createdAt,
			updatedAt: mapped.updatedAt,
			deletedAt: mapped.deletedAt,
		};
	}

	async getChatMessages(
		chatId: string,
		page: number,
		limit: number,
	): Promise<{ messages: Message[]; total: number }> {
    // TODO: update the method to use the cursor 
		const skip = (page - 1) * limit;
		const [messages, total] = await Promise.all([
			this._model.find({ chatId: chatId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this._model.countDocuments({ chatId: chatId }),
    ]);
    return { messages: messages ? messages.reverse().map(this.mapToDomain) : [], total };
  }

  async markMessagesAsRead(messageId: string, chatId: string, senderId: string): Promise<void> {
    // mark all non read messages in the chat send before this chat as read 
    const ref = await this._model.findById(messageId).select('createdAt').lean();
    if (!ref) return; 

    await this._model.updateMany(
      {
        chatId,
        senderId,
        createdAt: { $lte: ref.createdAt }, 
        status: { $ne: 'read' },
      },
      {
        $set: { status: 'read' },
      },
    ).exec();

  }
}
