import { ChatEvent } from "../../../domain/entities/chatEvent.entity";
import { IChatEventRepository } from "../../../domain/repositories/chatEvent.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { ChatEventModel, IChatEvent } from "../models/chatEvent.model";
import { BaseRepository } from "./base.repository";

export class ChatEventRepository
	extends BaseRepository<ChatEvent, IChatEvent>
	implements IChatEventRepository
{
	constructor() {
		super(ChatEventModel);
	}
	protected mapToDomain(doc: IChatEvent): ChatEvent {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			chatId: mapped.chatId,
			actorId: mapped.actorId,
			eventType: mapped.eventType,
			metaData: mapped.metaData,
			createdAt: mapped.createdAt,
		};
	}
}
