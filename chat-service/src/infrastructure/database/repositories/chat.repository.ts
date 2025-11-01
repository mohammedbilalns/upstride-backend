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
			type: mapped.type,
			name: mapped?.name,
			description: mapped?.description,
			avatar: mapped?.avatar,
			isArchived: mapped.isArchived,
			createdAt: mapped.createdAt,
			updatedAt: mapped.updatedAt,
		};
	}
}
