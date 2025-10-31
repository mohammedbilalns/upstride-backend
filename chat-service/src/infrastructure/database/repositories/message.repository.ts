import { Message } from "../../../domain/entities/message.entity";
import { IMessageRepository } from "../../../domain/repositories/message.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { MessageModel, IMessage } from "../models/message.model";
import { BaseRepository } from "./base.repository";

export class MessageRepository  extends BaseRepository<Message, IMessage> implements IMessageRepository {
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
      attachments: mapped.attachments,
      repliedTo: mapped.repliedTo,
      status: mapped.status,
      createdAt: mapped.createdAt,
      updatedAt: mapped.updatedAt,
      deletedAt: mapped.deletedAt
    }
  }
}
